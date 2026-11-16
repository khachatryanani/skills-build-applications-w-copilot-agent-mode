import { Activity, Team, User, Workout } from '../models/index.js';
import mongoose from 'mongoose';

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  if (!input || typeof input !== 'object') {
    const error = new Error('Invalid input');
    Object.assign(error, { status: 400 });
    throw error;
  }

  const { userId, teamId, type, minutes } = input as Record<string, unknown>;

  if (!userId || !teamId || !type || minutes === undefined) {
    const error = new Error('Missing required fields');
    Object.assign(error, { status: 400 });
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(String(userId))) {
    const error = new Error('Invalid userId');
    Object.assign(error, { status: 400 });
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(String(teamId))) {
    const error = new Error('Invalid teamId');
    Object.assign(error, { status: 400 });
    throw error;
  }

  const userExists = await User.exists({ _id: userId });
  const teamExists = await Team.exists({ _id: teamId });

  if (!userExists || !teamExists) {
    const error = new Error('User or team not found');
    Object.assign(error, { status: 400 });
    throw error;
  }

  const points = typeof minutes === 'number' ? Math.ceil(minutes) : 0;
  const activity = await Activity.create({
    user: userId,
    team: teamId,
    type,
    minutes,
    points,
    occurredAt: new Date(),
  });

  return activity.toObject();
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  if (!input || typeof input !== 'object') {
    const error = new Error('Invalid input');
    Object.assign(error, { status: 400 });
    throw error;
  }

  const { name, mascot, members = [] } = input as Record<string, unknown>;

  if (!name || !mascot) {
    const error = new Error('Missing required fields: name and mascot');
    Object.assign(error, { status: 400 });
    throw error;
  }

  const team = await Team.create({
    name,
    mascot,
    members: Array.isArray(members) ? members : [],
  });

  return team.toObject();
}

export async function getLeaderboard() {
  const pipeline: any[] = [
    {
      $group: {
        _id: '$team',
        totalPoints: { $sum: '$points' },
      },
    },
    {
      $lookup: {
        from: 'teams',
        localField: '_id',
        foreignField: '_id',
        as: 'teamData',
      },
    },
    {
      $unwind: '$teamData',
    },
    {
      $sort: { totalPoints: -1 },
    },
    {
      $project: {
        _id: 0,
        teamName: '$teamData.name',
        totalPoints: 1,
      },
    },
  ];

  const results = await Activity.aggregate(pipeline);

  return results.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

export async function suggestWorkouts(userEmail: string) {
  const decodedEmail = decodeURIComponent(userEmail);
  const user = await User.findOne({ email: decodedEmail }).lean();

  if (!user) {
    const error = new Error('User not found');
    Object.assign(error, { status: 404 });
    throw error;
  }

  const userActivities = await Activity.find({ user: user._id }).sort({ occurredAt: -1 }).lean();
  const mostRecentActivityType = userActivities[0]?.type;

  const workouts = await Workout.find({ focus: user.fitnessGoal }).lean();

  return workouts.map((workout) => ({
    ...workout,
    reason: `Based on your ${user.fitnessGoal} fitness goal${mostRecentActivityType ? ` and recent ${mostRecentActivityType} activity` : ''}`,
  }));
}

export { User };
