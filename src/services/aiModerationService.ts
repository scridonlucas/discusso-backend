import axios from 'axios';
import prisma from '../utils/prismaClient';
import config from '../utils/config';
import { CustomAPIError, CustomModerationAIError } from '../utils/customErrors';

const OPEN_API_API_KEY = config.OPEN_AI_API_KEY;

if (!OPEN_API_API_KEY) {
  throw new CustomAPIError('OPEN_API_API_KEY is not defined');
}

export async function moderateContent(
  content: string
): Promise<{ flagged: boolean; severity?: number }> {}
