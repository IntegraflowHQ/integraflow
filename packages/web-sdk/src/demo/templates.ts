import { AnswerType, CTAType, LogicSingleCondition, LogicTextCondition, Survey } from '../types';

type Objective =
  | 'increase_user_adoption'
  | 'increase_conversion'
  | 'support_sales'
  | 'sharpen_marketing_messaging'
  | 'improve_user_retention'
  | 'other';

interface Template {
  name: string;
  description: string;
  icon?: any;
  category?: 'Product Experience' | 'Exploration' | 'Growth' | 'Increase Revenue' | 'Customer Success';
  objectives?: [Objective, Objective?, Objective?];
  survey: Survey;
}

export const templates: Template[] = [
  {
    name: 'Product Market Fit (Superhuman)',
    category: 'Product Experience',
    description: 'Measure PMF by assessing how disappointed users would be if your product disappeared.',
    survey: {
      id: 1,
      name: 'Product Market Fit (Superhuman)',
      questions: [
        {
          id: 1,
          type: AnswerType.SINGLE,
          orderNumber: 1,
          label: 'How disappointed would you be if you could no longer use Formily?',
          description: 'Please select one of the following options:',
          maxPath: 4,
          options: [
            {
              id: 1,
              label: 'Not at all disappointed',
              orderNumber: 1
            },
            {
              id: 2,
              label: 'Somewhat disappointed',
              orderNumber: 2
            },
            {
              id: 3,
              label: 'Very disappointed',
              orderNumber: 3
            },
          ],
          settings: {
            randomize: true,
            randomizeExceptLast: false
          }
        },
        {
          id: 2,
          type: AnswerType.MULTIPLE,
          orderNumber: 2,
          label: 'What is your role, {{answer:1 | "Jimoh"}}?',
          description: 'Please select one of the following options:',
          maxPath: 3,
          options: [
            {
              id: 1,
              label: 'Founder',
              orderNumber: 1
            },
            {
              id: 2,
              label: 'Executive',
              orderNumber: 2
            },
            {
              id: 3,
              label: 'Product Manager',
              orderNumber: 3
            },
            {
              id: 4,
              label: 'Product Owner',
              orderNumber: 4
            },
            {
              id: 5,
              label: 'Software Engineer',
              orderNumber: 5
            },
          ],
          settings: {
            randomize: false,
            randomizeExceptLast: false,
            logic: [{
              id: 1,
              orderNumber: 1,
              destination: 4,
              condition: LogicSingleCondition.IS,
              values: [1, 2, 3, 4]
            }, {
              id: 2,
              orderNumber: 2,
              destination: 3,
              condition: LogicSingleCondition.IS,
              values: [5]
            }]
          }
        },
        {
          id: 3,
          type: AnswerType.TEXT,
          orderNumber: 3,
          label: 'What type of people do you think would most benefit from Formily?',
          maxPath: 2,
          settings: {
            singleLine: false,
            logic: [{
              id: 1,
              orderNumber: 1,
              destination: 6,
              condition: LogicTextCondition.HAS_ANY_VALUE
            }]
          }
        },
        {
          id: 4,
          type: AnswerType.TEXT,
          orderNumber: 4,
          maxPath: 2,
          label: 'What is the main benefit you receive from Formily?',
          settings: {
            singleLine: false
          }
        },
        {
          id: 5,
          type: AnswerType.TEXT,
          orderNumber: 5,
          maxPath: 1,
          label: 'How can we improve our service for you?',
          description: 'Please be as specific as possible.',
          settings: {
            singleLine: false
          }
        },
        {
          id: 6,
          type: AnswerType.CTA,
          orderNumber: 6,
          maxPath: 0,
          label: 'Thank you!',
          description: 'We appreciate your feedback.',
          settings: {
            type: CTAType.CLOSE, 
            text: 'Close'
          }
        },
      ],
      settings: {
        recurring: false,
        recurringPeriod: 0,
        placement: 'bottomRight',
        showProgressBar: true,
      },
    },
  }, {
    name: 'Onboarding Segmentation',
    category: 'Product Experience',
    description: 'Learn more about who signed up to your product and why.',
    survey: {
      id: 2,
      name: 'Onboarding Segmentation',
      questions: [
        {
          id: 1,
          type: AnswerType.SINGLE,
          orderNumber: 1,
          label: 'What is your role?',
          description: 'Please select one of the following options:',
          maxPath: 3,
          options: [
            {
              id: 1,
              label: 'Founder',
              orderNumber: 1
            },
            {
              id: 2,
              label: 'Executive',
              orderNumber: 2
            },
            {
              id: 3,
              label: 'Product Manager',
              orderNumber: 3
            },
            {
              id: 4,
              label: 'Product Owner',
              orderNumber: 4
            },
            {
              id: 5,
              label: 'Software Engineer',
              orderNumber: 5
            },
          ],
          settings: {
            randomize: false,
            randomizeExceptLast: false
          }
        },
        {
          id: 2,
          type: AnswerType.SINGLE,
          orderNumber: 2,
          label: 'What\'s your company size?',
          description: 'Please select one of the following options:',
          maxPath: 2,
          options: [
            {
              id: 1,
              label: 'only me',
              orderNumber: 1
            },
            {
              id: 2,
              label: '1-5 employees',
              orderNumber: 2
            },
            {
              id: 3,
              label: '6-10 employees',
              orderNumber: 3
            },
            {
              id: 4,
              label: '11-100 employees',
              orderNumber: 4
            },
            {
              id: 5,
              label: 'over 100 employees',
              orderNumber: 5
            },
          ],
          settings: {
            randomize: false,
            randomizeExceptLast: false
          }
        },
        {
          id: 3,
          type: AnswerType.SINGLE,
          label: 'How did you hear about us first?',
          description: 'Please select one of the following options:',
          maxPath: 1,
          orderNumber: 3,
          options: [
            {
              id: 1,
              label: 'Recommendation',
              orderNumber: 1
            },
            {
              id: 2,
              label: 'Social Media',
              orderNumber: 2
            },
            {
              id: 3,
              label: 'Ads',
              orderNumber: 3
            },
            {
              id: 4,
              label: 'Google Search',
              orderNumber: 4
            },
            {
              id: 5,
              label: 'In a Podcast',
              orderNumber: 5
            },
          ],
          settings: {
            randomize: false,
            randomizeExceptLast: false
          }
        },
        {
          id: 4,
          type: AnswerType.CTA,
          orderNumber: 6,
          label: 'Thank you!',
          description: 'We appreciate your feedback.',
          maxPath: 0,
          settings: {
            type: CTAType.CLOSE, 
            text: 'Close'
          }
        },
      ],
      settings: {
        recurring: false,
        recurringPeriod: 0,
        placement: 'center',
        showProgressBar: true,
      },
    }
  }
];
