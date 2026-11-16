import { Course, CourseCategory, Lesson, MultipleChoiceQuestion } from '../types';

export interface RawLessonInput {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  gemReward: number;
  questions: MultipleChoiceQuestion[];
}

export interface RawUnitInput {
  id: string;
  title: string;
  description: string;
  color: string;
  lessons: RawLessonInput[];
}

export interface RawCourseInput {
  id: CourseCategory;
  title: string;
  description: string;
  icon: string;
  badge: string;
  color: string;
  accentColor: string;
  units: RawUnitInput[];
}

export function buildCourse(raw: RawCourseInput): Course {
  return {
    ...raw,
    name: raw.title,
    subTitle: raw.description,
    units: raw.units.map((u, uIdx) => ({
      ...u,
      number: uIdx + 1,
      lessons: u.lessons.map(
        (l): Lesson => ({
          ...l,
          unitId: u.id,
          type: 'lesson',
        })
      ),
    })),
  };
}
