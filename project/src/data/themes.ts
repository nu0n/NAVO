import { AppTheme } from '../types';

export const themes: AppTheme[] = [
  {
    id: 'neon-nexus',
    name: 'Neon Nexus',
    description: 'Cyberpunk-inspired with holographic elements and electric energy',
    colors: {
      primary: '#00D4FF',
      secondary: '#A855F7',
      accent: '#EC4899',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#A1A1AA'
    },
    gradients: {
      primary: 'from-cyan-400 via-purple-500 to-pink-500',
      secondary: 'from-blue-500 via-cyan-500 to-teal-500',
      accent: 'from-pink-400 via-purple-500 to-cyan-500',
      danger: 'from-red-400 via-pink-500 to-orange-500',
      success: 'from-green-400 via-emerald-500 to-teal-500',
      warning: 'from-yellow-400 via-orange-500 to-red-500'
    },
    effects: {
      blur: 'backdrop-blur-xl',
      glow: 'shadow-cyan-500/50',
      shadow: 'shadow-2xl',
      border: 'border-white/20'
    },
    animations: {
      duration: '2s',
      easing: 'ease-in-out',
      particles: true,
      morphing: true
    }
  },
  {
    id: 'aurora-dreams',
    name: 'Aurora Dreams',
    description: 'Ethereal northern lights with soft, flowing gradients',
    colors: {
      primary: '#10B981',
      secondary: '#3B82F6',
      accent: '#8B5CF6',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8'
    },
    gradients: {
      primary: 'from-emerald-400 via-teal-500 to-cyan-600',
      secondary: 'from-blue-400 via-indigo-500 to-purple-600',
      accent: 'from-purple-400 via-pink-500 to-rose-500',
      danger: 'from-rose-400 via-red-500 to-orange-600',
      success: 'from-emerald-400 via-green-500 to-teal-600',
      warning: 'from-amber-400 via-yellow-500 to-orange-600'
    },
    effects: {
      blur: 'backdrop-blur-2xl',
      glow: 'shadow-emerald-500/30',
      shadow: 'shadow-xl',
      border: 'border-emerald-300/20'
    },
    animations: {
      duration: '3s',
      easing: 'ease-out',
      particles: true,
      morphing: false
    }
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    description: 'Warm, energetic design inspired by solar energy and fire',
    colors: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#F97316',
      background: '#1C1917',
      surface: '#292524',
      text: '#FBBF24',
      textSecondary: '#A3A3A3'
    },
    gradients: {
      primary: 'from-yellow-400 via-orange-500 to-red-600',
      secondary: 'from-orange-400 via-red-500 to-pink-600',
      accent: 'from-amber-400 via-orange-500 to-red-500',
      danger: 'from-red-500 via-rose-600 to-pink-700',
      success: 'from-lime-400 via-green-500 to-emerald-600',
      warning: 'from-yellow-300 via-amber-400 to-orange-500'
    },
    effects: {
      blur: 'backdrop-blur-lg',
      glow: 'shadow-orange-500/40',
      shadow: 'shadow-xl',
      border: 'border-orange-300/30'
    },
    animations: {
      duration: '1.5s',
      easing: 'ease-in-out',
      particles: false,
      morphing: true
    }
  },
  {
    id: 'midnight-ocean',
    name: 'Midnight Ocean',
    description: 'Deep sea vibes with bioluminescent accents and fluid motion',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: '#0C1426',
      surface: '#1E293B',
      text: '#E2E8F0',
      textSecondary: '#64748B'
    },
    gradients: {
      primary: 'from-blue-500 via-cyan-500 to-teal-400',
      secondary: 'from-indigo-500 via-blue-600 to-cyan-600',
      accent: 'from-purple-500 via-violet-600 to-indigo-700',
      danger: 'from-red-400 via-rose-500 to-pink-600',
      success: 'from-teal-400 via-cyan-500 to-blue-600',
      warning: 'from-yellow-400 via-amber-500 to-orange-600'
    },
    effects: {
      blur: 'backdrop-blur-xl',
      glow: 'shadow-blue-500/30',
      shadow: 'shadow-2xl',
      border: 'border-blue-300/20'
    },
    animations: {
      duration: '4s',
      easing: 'ease-in-out',
      particles: true,
      morphing: false
    }
  },
  {
    id: 'forest-guardian',
    name: 'Forest Guardian',
    description: 'Nature-inspired with organic shapes and earth tones',
    colors: {
      primary: '#059669',
      secondary: '#0D9488',
      accent: '#84CC16',
      background: '#1C2617',
      surface: '#2D3A24',
      text: '#ECFDF5',
      textSecondary: '#86EFAC'
    },
    gradients: {
      primary: 'from-green-500 via-emerald-600 to-teal-700',
      secondary: 'from-teal-500 via-green-600 to-emerald-700',
      accent: 'from-lime-400 via-green-500 to-emerald-600',
      danger: 'from-red-400 via-orange-500 to-yellow-600',
      success: 'from-green-400 via-emerald-500 to-teal-600',
      warning: 'from-yellow-400 via-lime-500 to-green-600'
    },
    effects: {
      blur: 'backdrop-blur-lg',
      glow: 'shadow-green-500/40',
      shadow: 'shadow-lg',
      border: 'border-green-300/30'
    },
    animations: {
      duration: '3s',
      easing: 'ease-out',
      particles: false,
      morphing: false
    }
  }
];

export const getThemeById = (id: string): AppTheme => {
  return themes.find(theme => theme.id === id) || themes[0];
};