export type AuthContextProps = {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
};

export type ProfileModel = {
  userId: string;
  name: string;
  location: string;
  age: number | null;
  lastSeen: string;
  videoUrl?: string;
  avatar?: string;
  sumary: string;
  intro: string;
  lifeStory: string;
  freeTime: string;
  other: string;
  accomplishments: string;
  education: string[];
  employment: string[];
  startup?: {
    name?: string;
    description?: string;
    progress?: string;
    funding?: string;
  };
  cofounderPreferences: {
    requirements: string[];
    idealPersonality: string;
    equity: string;
  };
  interests: {
    shared: string[];
    personal: string[];
  };
  linkedIn?: string;
  viewers?: Record<string, boolean>;
};

export type FilterModel = {
  name?: string;
  age?: number;
  location?: string;
  sumary?: string;
  startupName?: string;
  funding?: string;
};
