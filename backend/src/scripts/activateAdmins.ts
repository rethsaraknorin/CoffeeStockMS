import prisma from '../config/database';

async function main() {
  const result = await prisma.user.updateMany({
    where: { role: 'ADMIN', status: { not: 'ACTIVE' } },
    data: {
      status: 'ACTIVE',
      approvedAt: new Date(),
      approvalToken: null,
      approvalTokenExpires: null
    }
  });

  console.log(`Activated ${result.count} admin account(s).`);
}

main()
  .catch((error) => {
    console.error('Failed to activate admins:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
