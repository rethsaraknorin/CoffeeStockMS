import prisma from '../config/database';
import { hashPassword, comparePasword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'STAFF';
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  username?: string;
  email?: string;
}

export const authService = {
  // Register new user
  register: async (data: RegisterData) => {
    const { username, email, password, role } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'STAFF'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return { user, token };
  },

  // Login user
  login: async (data: LoginData) => {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await comparePasword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  // Get user profile
  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  // Update user profile
  updateProfile: async (userId: string, data: UpdateProfileData) => {
    const { username, email } = data;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    const orConditions: { username?: string; email?: string }[] = [];
    if (username) {
      orConditions.push({ username });
    }
    if (email) {
      orConditions.push({ email });
    }

    if (orConditions.length > 0) {
      const conflict = await prisma.user.findFirst({
        where: {
          OR: orConditions,
          NOT: { id: userId }
        }
      });

      if (conflict) {
        throw new Error('User with this email or username already exists');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username ? { username } : {}),
        ...(email ? { email } : {})
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const token = generateToken({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    });

    return { user: updatedUser, token };
  },

  // Change user password
  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await comparePasword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return true;
  }
};
