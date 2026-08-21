// prisma/seed.ts
// Reproducible demo data for local development and assessment review.

import bcrypt from 'bcryptjs';
import prisma from '../src/db/prisma';

const DEMO_PASSWORD = 'TaskFlowDemo2026!';
const PROJECT_COUNT = 50;
const MIN_TASKS_PER_PROJECT = 3;
const TASK_RANGE = 10;

const demoUsers = [
  { name: 'Abid Rahman', email: 'abid@taskflow.demo' },
  { name: 'Nadia Islam', email: 'nadia@taskflow.demo' },
  { name: 'Tanvir Hasan', email: 'tanvir@taskflow.demo' },
  { name: 'Sadia Ahmed', email: 'sadia@taskflow.demo' },
  { name: 'Rafi Karim', email: 'rafi@taskflow.demo' },
] as const;

const projectThemes = [
  'Website Redesign', 'Mobile Application', 'Customer Portal', 'Analytics Dashboard',
  'Payment Integration', 'Marketing Campaign', 'Platform Reliability', 'Developer Experience',
  'Product Launch', 'Data Migration',
] as const;

const taskTemplates = [
  'Define project scope', 'Create implementation plan', 'Build core experience',
  'Review quality and accessibility', 'Prepare stakeholder update', 'Release and monitor',
] as const;

const statuses = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
const priorities = ['LOW', 'MEDIUM', 'HIGH'] as const;

async function main() {
  console.log(`Seeding ${PROJECT_COUNT} projects with varied task counts...`);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const users = await Promise.all(
    demoUsers.map((user) => prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, passwordHash },
      create: { ...user, passwordHash },
    })),
  );

  const owner = users[0];
  const projectIds = Array.from(
    { length: PROJECT_COUNT },
    (_, index) => `assessment-project-${String(index + 1).padStart(3, '0')}`,
  );

  // Keep the seed idempotent: remove tasks created by a previous seed run only.
  await prisma.task.deleteMany({ where: { projectId: { in: projectIds } } });

  for (let projectIndex = 0; projectIndex < PROJECT_COUNT; projectIndex += 1) {
    const projectNumber = projectIndex + 1;
    const theme = projectThemes[projectIndex % projectThemes.length];
    const projectId = projectIds[projectIndex];
    const project = {
      title: `${theme} ${projectNumber}`,
      description: `Assessment demo project ${projectNumber} for planning, delivery, and collaboration.`,
      ownerId: owner.id,
    };
    await prisma.project.upsert({ where: { id: projectId }, update: project, create: { id: projectId, ...project } });
  }

  const tasks = projectIds.flatMap((projectId, projectIndex) => {
    const taskCount = MIN_TASKS_PER_PROJECT + ((projectIndex * 7) % TASK_RANGE);
    return Array.from({ length: taskCount }, (_, taskIndex) => ({
      projectId,
      title: `${taskTemplates[taskIndex % taskTemplates.length]} — Project ${projectIndex + 1}`,
      description: `Demo task ${taskIndex + 1} for assessment project ${projectIndex + 1}.`,
      status: statuses[taskIndex % statuses.length],
      priority: priorities[(projectIndex + taskIndex) % priorities.length],
      assignedTo: users[(projectIndex + taskIndex) % users.length].id,
      dueDate: new Date(Date.UTC(2026, 8, 1 + projectIndex + taskIndex)),
    }));
  });

  await prisma.task.createMany({ data: tasks });
  console.log(`✅ Seed complete: ${users.length} users, ${PROJECT_COUNT} projects, ${tasks.length} tasks.`);
  console.log(`   Login: ${owner.email} / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
