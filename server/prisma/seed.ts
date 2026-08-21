// prisma/seed.ts
// Optional seed data for local development.

import bcrypt from 'bcryptjs';
import prisma from '../src/db/prisma';

async function main() {
    console.log('Seeding database...');

    // Create demo users
    const alice = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            passwordHash: await bcrypt.hash('password123', 12),
        },
    });

    const bob = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: {
            name: 'Bob Smith',
            email: 'bob@example.com',
            passwordHash: await bcrypt.hash('password123', 12),
        },
    });

    // Create a demo project
    const project = await prisma.project.upsert({
        where: { id: 'seed-project-1' },
        update: {},
        create: {
            id: 'seed-project-1',
            title: 'TaskFlow Demo Project',
            description: 'A sample project created during database seeding.',
            ownerId: alice.id,
        },
    });

    // Create demo tasks
    const tasks = [
        { title: 'Set up repository', status: 'DONE' as const, priority: 'HIGH' as const, assignedTo: alice.id },
        { title: 'Design database schema', status: 'DONE' as const, priority: 'HIGH' as const, assignedTo: alice.id },
        { title: 'Implement authentication API', status: 'IN_PROGRESS' as const, priority: 'HIGH' as const, assignedTo: bob.id },
        { title: 'Build Kanban board UI', status: 'IN_PROGRESS' as const, priority: 'MEDIUM' as const, assignedTo: alice.id },
        { title: 'Add task search functionality', status: 'TODO' as const, priority: 'MEDIUM' as const, assignedTo: bob.id },
        { title: 'Write API documentation', status: 'TODO' as const, priority: 'LOW' as const },
        { title: 'Deploy to production', status: 'TODO' as const, priority: 'LOW' as const },
    ];

    for (const taskData of tasks) {
        await prisma.task.create({
            data: {
                ...taskData,
                projectId: project.id,
            },
        });
    }

    console.log('✅ Seed complete');
    console.log('   alice@example.com / password123');
    console.log('   bob@example.com   / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
