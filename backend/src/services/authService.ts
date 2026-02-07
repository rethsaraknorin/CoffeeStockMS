import prisma from '../config/database';
import { hashPassword, comparePasword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { randomBytes } from 'crypto';
import { notificationService } from './notificationService';

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

const generateUniqueUsername = async (base: string) => {
  const safeBase = base.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'user';
  let candidate = safeBase.slice(0, 20);
  let suffix = 0;
  // Try a few times to avoid collisions
  while (suffix < 5) {
    const existing = await prisma.user.findUnique({
      where: { username: candidate }
    });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${safeBase.slice(0, 16)}${suffix}${Math.floor(Math.random() * 9)}`;
  }
  return `${safeBase.slice(0, 16)}${Date.now().toString().slice(-4)}`;
};

export const authService = {
  // Register new user
  register: async (data: RegisterData) => {
    const { username, email, password } = data;

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

    const approvalToken = randomBytes(32).toString('hex');
    const approvalTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);

    // Create user (pending approval)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'STAFF',
        status: 'PENDING',
        approvalToken,
        approvalTokenExpires
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    // Notify admins for approval
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN', status: 'ACTIVE' },
        select: { email: true }
      });
      const approvalUrl =
        `${process.env.API_BASE_URL || 'http://localhost:5000/api'}/auth/approve?token=${approvalToken}`;

      await Promise.all(
        admins.map((admin) =>
          notificationService.sendApprovalRequestEmail(admin.email, {
            username: user.username,
            email: user.email,
            approvalUrl
          })
        )
      );
    } catch (error) {
      // Do not block registration if email fails
      console.error('Approval email failed:', error);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
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

    if (user.status === 'REJECTED') {
      throw new Error('Your account was rejected. Please contact an admin.');
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
      role: user.role,
      status: user.status
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  loginWithGoogle: async (profile: { email: string; name?: string }) => {
    const { email, name } = profile;

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.status === 'REJECTED') {
        throw new Error('Your account was rejected. Please contact an admin.');
      }

      const token = generateToken({
        id: existing.id,
        username: existing.username,
        email: existing.email,
        role: existing.role,
        status: existing.status
      });

      const { password: _, ...userWithoutPassword } = existing;
      return { user: userWithoutPassword, token };
    }

    const approvalToken = randomBytes(32).toString('hex');
    const approvalTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    const username = await generateUniqueUsername(name || email.split('@')[0]);
    const randomPassword = randomBytes(24).toString('hex');
    const hashedPassword = await hashPassword(randomPassword);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'STAFF',
        status: 'PENDING',
        approvalToken,
        approvalTokenExpires
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN', status: 'ACTIVE' },
        select: { email: true }
      });
      const approvalUrl =
        `${process.env.API_BASE_URL || 'http://localhost:5000/api'}/auth/approve?token=${approvalToken}`;

      await Promise.all(
        admins.map((admin) =>
          notificationService.sendApprovalRequestEmail(admin.email, {
            username: user.username,
            email: user.email,
            approvalUrl
          })
        )
      );
    } catch (error) {
      console.error('Approval email failed:', error);
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    });

    return { user, token };
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
        status: true,
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
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const token = generateToken({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status
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
  },

  approveByToken: async (token: string) => {
    const user = await prisma.user.findFirst({
      where: {
        approvalToken: token,
        approvalTokenExpires: {
          gte: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired approval token');
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE',
        approvalToken: null,
        approvalTokenExpires: null,
        approvedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }
};
