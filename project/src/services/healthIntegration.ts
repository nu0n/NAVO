interface HealthData {
  steps: number;
  heartRate?: number;
  calories?: number;
  sleepHours?: number;
  workouts?: number;
  weight?: number;
  timestamp: Date;
}

interface FitnessGoal {
  type: 'steps' | 'calories' | 'workouts' | 'weight' | 'sleep';
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
}

class HealthIntegrationService {
  private healthData: HealthData[] = [];
  private goals: FitnessGoal[] = [];
  private isTracking = false;

  constructor() {
    this.initializeHealthTracking();
  }

  private initializeHealthTracking() {
    // Check for available health APIs
    this.checkHealthAPIs();
    
    // Load saved health data
    this.loadHealthData();
    
    // Start periodic health data collection
    this.startHealthTracking();
  }

  private checkHealthAPIs() {
    // Check for Web APIs that might provide health data
    const availableAPIs = {
      deviceMotion: 'DeviceMotionEvent' in window,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      geolocation: 'geolocation' in navigator,
      bluetooth: 'bluetooth' in navigator,
      usb: 'usb' in navigator
    };

    console.log('Available Health APIs:', availableAPIs);

    // Request permissions for device motion (for step counting)
    if (availableAPIs.deviceMotion && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.enableStepCounting();
        }
      }).catch(err => {
        console.log('Permission request error:', err);
        // Continue with simulation
      });
    } else if (availableAPIs.deviceMotion) {
      this.enableStepCounting();
    }
  }

  private enableStepCounting() {
    let stepCount = 0;
    let lastAcceleration = { x: 0, y: 0, z: 0 };
    let stepThreshold = 1.2;

    window.addEventListener('devicemotion', (event) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        
        // Simple step detection algorithm
        const totalAcceleration = Math.sqrt(x*x + y*y + z*z);
        const lastTotal = Math.sqrt(
          lastAcceleration.x * lastAcceleration.x +
          lastAcceleration.y * lastAcceleration.y +
          lastAcceleration.z * lastAcceleration.z
        );
        
        const accelerationDelta = Math.abs(totalAcceleration - lastTotal);
        
        if (accelerationDelta > stepThreshold) {
          stepCount++;
          this.updateSteps(stepCount);
        }
        
        lastAcceleration = { x: x || 0, y: y || 0, z: z || 0 };
      }
    });
  }

  private updateSteps(steps: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayData = this.healthData.find(data => 
      data.timestamp.getTime() === today.getTime()
    );
    
    if (todayData) {
      todayData.steps = steps;
    } else {
      this.healthData.push({
        steps,
        timestamp: today
      });
    }
    
    this.saveHealthData();
  }

  private startHealthTracking() {
    if (this.isTracking) return;
    
    this.isTracking = true;
    
    // Simulate health data collection every minute
    setInterval(() => {
      this.simulateHealthData();
    }, 60000);
  }

  private simulateHealthData() {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get or create today's health data
    let todayData = this.healthData.find(data => 
      data.timestamp.getTime() === today.getTime()
    );
    
    if (!todayData) {
      todayData = {
        steps: 0,
        timestamp: today
      };
      this.healthData.push(todayData);
    }
    
    // Simulate gradual increase in steps throughout the day
    const hourOfDay = now.getHours();
    const baseSteps = Math.floor((hourOfDay / 24) * 8000); // Target 8000 steps per day
    const randomVariation = Math.floor(Math.random() * 500);
    todayData.steps = Math.max(todayData.steps, baseSteps + randomVariation);
    
    // Simulate other health metrics
    if (Math.random() > 0.7) { // 30% chance to update other metrics
      todayData.heartRate = 60 + Math.floor(Math.random() * 40); // 60-100 BPM
      todayData.calories = Math.floor(todayData.steps * 0.04); // Rough calorie estimate
    }
    
    this.saveHealthData();
  }

  private loadHealthData() {
    try {
      const saved = localStorage.getItem('health_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.healthData = parsed.map((data: any) => ({
          ...data,
          timestamp: new Date(data.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  }

  private saveHealthData() {
    try {
      localStorage.setItem('health_data', JSON.stringify(this.healthData));
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }

  // Public API methods
  getTodaysData(): HealthData | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.healthData.find(data => 
      data.timestamp.getTime() === today.getTime()
    ) || null;
  }

  getWeeklyData(): HealthData[] {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    
    return this.healthData.filter(data => 
      data.timestamp >= weekAgo
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  addManualEntry(data: Partial<HealthData>) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let todayData = this.healthData.find(d => 
      d.timestamp.getTime() === today.getTime()
    );
    
    if (!todayData) {
      todayData = {
        steps: 0,
        timestamp: today
      };
      this.healthData.push(todayData);
    }
    
    // Update with manual data
    Object.assign(todayData, data);
    this.saveHealthData();
  }

  setGoal(goal: Omit<FitnessGoal, 'current'>) {
    const existingGoalIndex = this.goals.findIndex(g => g.type === goal.type);
    const newGoal: FitnessGoal = {
      ...goal,
      current: 0
    };
    
    if (existingGoalIndex >= 0) {
      this.goals[existingGoalIndex] = newGoal;
    } else {
      this.goals.push(newGoal);
    }
    
    this.updateGoalProgress();
  }

  private updateGoalProgress() {
    const todayData = this.getTodaysData();
    if (!todayData) return;
    
    this.goals.forEach(goal => {
      switch (goal.type) {
        case 'steps':
          goal.current = todayData.steps;
          break;
        case 'calories':
          goal.current = todayData.calories || 0;
          break;
        case 'workouts':
          goal.current = todayData.workouts || 0;
          break;
        case 'sleep':
          goal.current = todayData.sleepHours || 0;
          break;
        case 'weight':
          goal.current = todayData.weight || 0;
          break;
      }
    });
  }

  getGoals(): FitnessGoal[] {
    this.updateGoalProgress();
    return this.goals;
  }

  // Connect to external fitness apps (placeholder for real integrations)
  async connectToFitnessApp(appName: 'googlefit' | 'applehealth' | 'fitbit' | 'strava'): Promise<boolean> {
    // In a real implementation, this would handle OAuth flows for each service
    console.log(`Attempting to connect to ${appName}...`);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, we'll simulate successful connection and import some data
    this.simulateImportedData(appName);
    
    return true;
  }

  private simulateImportedData(appName: string) {
    const today = new Date();
    
    // Simulate importing last 7 days of data
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const existingData = this.healthData.find(d => 
        d.timestamp.getTime() === date.getTime()
      );
      
      if (!existingData) {
        const simulatedData: HealthData = {
          steps: Math.floor(Math.random() * 5000) + 3000, // 3000-8000 steps
          heartRate: Math.floor(Math.random() * 30) + 60, // 60-90 BPM
          calories: Math.floor(Math.random() * 800) + 1200, // 1200-2000 calories
          sleepHours: Math.random() * 3 + 6, // 6-9 hours
          workouts: Math.random() > 0.7 ? 1 : 0, // 30% chance of workout
          timestamp: date
        };
        
        this.healthData.push(simulatedData);
      }
    }
    
    this.saveHealthData();
  }

  // Get health insights
  getHealthInsights(): string[] {
    const weeklyData = this.getWeeklyData();
    const insights: string[] = [];
    
    if (weeklyData.length === 0) {
      return ['Start tracking your health data to get personalized insights!'];
    }
    
    // Steps analysis
    const avgSteps = weeklyData.reduce((sum, data) => sum + data.steps, 0) / weeklyData.length;
    if (avgSteps < 5000) {
      insights.push('Try to increase your daily steps. Aim for at least 8,000 steps per day.');
    } else if (avgSteps > 10000) {
      insights.push('Great job staying active! You\'re exceeding the recommended daily steps.');
    }
    
    // Sleep analysis
    const sleepData = weeklyData.filter(d => d.sleepHours);
    if (sleepData.length > 0) {
      const avgSleep = sleepData.reduce((sum, data) => sum + (data.sleepHours || 0), 0) / sleepData.length;
      if (avgSleep < 7) {
        insights.push('Consider getting more sleep. Aim for 7-9 hours per night for optimal health.');
      }
    }
    
    // Workout consistency
    const workoutDays = weeklyData.filter(d => d.workouts && d.workouts > 0).length;
    if (workoutDays < 3) {
      insights.push('Try to exercise at least 3 times per week for better fitness.');
    }
    
    return insights.length > 0 ? insights : ['Keep up the great work with your health tracking!'];
  }
}

export const healthIntegration = new HealthIntegrationService();