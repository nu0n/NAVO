import { LifeAchievement } from '../types';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface UserContext {
  age: number;
  interests: string[];
  goals: string[];
  achievements: string[];
  healthProfile?: any;
  careerProfile?: any;
  personality?: any;
}

class GeminiAIService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  private quotaExceeded = false;

  constructor() {
    // Use the provided API key
    this.apiKey = 'AIzaSyDi244IKI6aaasCWI7H8vuTpkMtJgQXvxI';
    if (!this.apiKey) {
      console.warn('Gemini API key not found. AI features will use fallback responses.');
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    // Check if quota has been exceeded
    if (this.quotaExceeded) {
      console.warn('Gemini API quota exceeded, using fallback response');
      return this.getFallbackResponse(prompt);
    }

    // Use user-provided API key if available
    let apiKeyToUse = '';
    try {
      apiKeyToUse = localStorage.getItem('geminiApiKey') || this.apiKey;
    } catch (e) {
      apiKeyToUse = this.apiKey;
    }
    if (!apiKeyToUse) {
      console.warn('No API key available, using fallback response');
      return this.getFallbackResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${apiKeyToUse}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API Error: ${response.status} - ${errorText}`);
        
        // Check if this is a quota exceeded error (429)
        if (response.status === 429) {
          this.quotaExceeded = true;
          console.warn('Gemini API quota exceeded. All future requests will use fallback responses.');
        }
        
        // Instead of throwing an error, return fallback response for any API errors
        return this.getFallbackResponse(prompt);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
      
      // Return fallback response if no candidates are generated
      return this.getFallbackResponse(prompt);
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  private getFallbackResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('health') || lowerPrompt.includes('fitness')) {
      return "• Track your daily steps in the Health section\n• Complete the 'Fitness Foundation' achievement\n• Use the Task Manager to schedule regular workouts\n• Monitor your progress in the Health Dashboard";
    }
    
    if (lowerPrompt.includes('career') || lowerPrompt.includes('work')) {
      return "• Check your Career section for personalized achievements\n• Complete skill-building tasks in your Task Manager\n• Track your professional milestones in your profile\n• Set specific career goals in the Achievement Hub";
    }
    
    if (lowerPrompt.includes('goal') || lowerPrompt.includes('achievement')) {
      return "• Visit your Achievement Hub for personalized recommendations\n• Break down goals into tasks using the Task Manager\n• Track your progress with photo verification\n• Earn rewards and level up your profile";
    }
    
    return "• Check your Achievement Hub for personalized recommendations\n• Use the Task Manager to organize your priorities\n• Track your progress in the relevant dashboard\n• Complete verification tasks to earn rewards";
  }

  private buildUserContext(user: UserContext): string {
    const context = [
      `User Profile: ${user.age} years old`,
      `Interests: ${user.interests.join(', ')}`,
      `Goals: ${user.goals.join(', ')}`,
      `Completed Achievements: ${user.achievements.length} achievements`
    ];

    if (user.healthProfile) {
      context.push(`Health: Activity level ${user.healthProfile.activityLevel}, Stress level ${user.healthProfile.stressLevel}/10`);
    }

    if (user.careerProfile) {
      context.push(`Career: ${user.careerProfile.currentRole || 'Not specified'}, ${user.careerProfile.experienceYears || 0} years experience`);
    }

    if (user.personality) {
      const traits = [];
      if (user.personality.introvert_extrovert <= 5) traits.push('introverted');
      else traits.push('extroverted');
      if (user.personality.risk_tolerance > 6) traits.push('risk-taking');
      if (user.personality.creativity > 6) traits.push('creative');
      context.push(`Personality: ${traits.join(', ')}`);
    }

    return context.join('\n');
  }

  async getPersonalizedAdvice(userMessage: string, userContext: UserContext): Promise<string> {
    const context = this.buildUserContext(userContext);
    
    const prompt = `You are CIVIL AI, a personalized life coach helping users achieve their goals within the CIVIL app. 

User Context:
${context}

User Selected: "${userMessage}"

Provide personalized, actionable advice based on their profile. Be encouraging, specific, and practical. Format your response as 3-5 bullet points of actionable steps they can take using CIVIL app features.

IMPORTANT GUIDELINES:
1. ONLY recommend actions that can be taken within the CIVIL app (achievements, tasks, tracking features)
2. NEVER suggest external apps, websites, or services
3. Keep your tone motivational and energetic
4. Use bullet points for all recommendations
5. Maintain the futuristic, holographic aesthetic of the app in your writing style
6. Focus on the user's specific goals and interests
7. Reference app features like "Achievement Hub", "Task Manager", "Health Tracking", etc.
8. Keep the entire response under 150 words`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error in getPersonalizedAdvice:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  async generateGoalPlan(goal: string, userContext: UserContext): Promise<string> {
    const context = this.buildUserContext(userContext);
    
    const prompt = `You are CIVIL AI, a goal-setting expert within the CIVIL app. Create a personalized plan for this goal.

User Context:
${context}

Goal: "${goal}"

Create a specific, actionable plan formatted as bullet points:
• 3-4 concrete steps to achieve this goal using CIVIL app features
• Realistic timeline within the app's achievement framework
• Potential obstacles and how to overcome them using app tools
• Success metrics that can be tracked in the app

IMPORTANT GUIDELINES:
1. ONLY recommend actions that can be taken within the CIVIL app
2. NEVER suggest external apps, websites, or services
3. Keep your tone motivational and energetic
4. Use bullet points for all recommendations
5. Maintain the futuristic, holographic aesthetic of the app in your writing style
6. Reference app features like "Achievement Hub", "Task Manager", "Health Tracking", etc.
7. Keep the entire response under 200 words`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error in generateGoalPlan:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  async analyzeProgress(achievements: string[], currentGoals: string[], userContext: UserContext): Promise<string> {
    const context = this.buildUserContext(userContext);
    
    const prompt = `You are CIVIL AI, analyzing user progress within the CIVIL app and providing insights.

User Context:
${context}

Recent Achievements: ${achievements.slice(-5).join(', ')}
Current Goals: ${currentGoals.join(', ')}

Provide a concise analysis with bullet points:
• One strength pattern they're demonstrating
• One area for improvement
• 2 specific recommendations for next steps using CIVIL app features

IMPORTANT GUIDELINES:
1. ONLY recommend actions within the CIVIL app
2. NEVER suggest external apps, websites, or services
3. Keep your tone motivational and energetic
4. Use bullet points for all recommendations
5. Maintain the futuristic, holographic aesthetic of the app
6. Keep the entire response under 150 words`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error in analyzeProgress:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  async getHealthRecommendations(healthData: any, userContext: UserContext): Promise<string> {
    const context = this.buildUserContext(userContext);
    
    const prompt = `You are CIVIL AI, a health and wellness advisor within the CIVIL app.

User Context:
${context}

Health Data:
- Activity Level: ${healthData.activityLevel}
- Stress Level: ${healthData.stressLevel}/10
- Sleep Hours: ${healthData.sleepHours || 'Not specified'}
- Fitness Goals: ${healthData.fitnessGoals?.join(', ') || 'None specified'}

Provide 3-4 personalized health recommendations as bullet points:
• Activity level optimization
• Stress management technique
• Sleep improvement tip
• Nutrition suggestion

IMPORTANT GUIDELINES:
1. ONLY recommend actions within the CIVIL app
2. NEVER suggest external apps, websites, or services
3. Keep recommendations realistic and achievable
4. Use bullet points for all recommendations
5. Maintain the futuristic, holographic aesthetic of the app
6. Keep the entire response under 150 words`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error in getHealthRecommendations:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  async getCareerAdvice(careerData: any, userContext: UserContext): Promise<string> {
    const context = this.buildUserContext(userContext);
    
    const prompt = `You are CIVIL AI, a career development advisor within the CIVIL app.

User Context:
${context}

Career Data:
- Current Role: ${careerData.currentRole || 'Not specified'}
- Experience: ${careerData.experienceYears || 0} years
- Career Goals: ${careerData.careerGoals?.join(', ') || 'None specified'}
- Skills: ${careerData.skills?.join(', ') || 'None specified'}
- Entrepreneurship Interest: ${careerData.entrepreneurshipInterest}/10

Provide 3-4 personalized career recommendations as bullet points:
• Next career step based on their experience
• Skill development recommendation
• Networking strategy
• Growth opportunity

IMPORTANT GUIDELINES:
1. ONLY recommend actions within the CIVIL app
2. NEVER suggest external apps, websites, or services
3. Keep recommendations realistic and achievable
4. Use bullet points for all recommendations
5. Maintain the futuristic, holographic aesthetic of the app
6. Keep the entire response under 150 words`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error in getCareerAdvice:', error);
      return this.getFallbackResponse(prompt);
    }
  }
  
  async getAchievementAdvice(achievement: LifeAchievement, userContext: UserContext): Promise<string> {
    const context = this.buildUserContext(userContext);
    
    const prompt = `You are CIVIL AI, an achievement coach within the CIVIL app.

User Context:
${context}

Achievement: "${achievement.name}"
Description: "${achievement.description}"
Category: ${achievement.category}
Difficulty: ${achievement.difficulty}
Time to Complete: ${achievement.timeToComplete}

Provide personalized advice for successfully completing this achievement as bullet points:
• 3 practical tips tailored to their profile
• Common obstacle and how to overcome it
• How this achievement connects to their broader goals
• A brief motivational message

IMPORTANT GUIDELINES:
1. ONLY recommend actions within the CIVIL app
2. NEVER suggest external apps, websites, or services
3. Keep recommendations realistic and achievable
4. Use bullet points for all recommendations
5. Maintain the futuristic, holographic aesthetic of the app
6. Keep the entire response under 200 words`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error in getAchievementAdvice:', error);
      return this.getFallbackResponse(prompt);
    }
  }
}

export const geminiAI = new GeminiAIService();