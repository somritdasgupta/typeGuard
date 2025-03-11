// Example type definitions paired with corresponding JSON inputs
export const examplePairs = [
  {
    name: 'Basic User',
    badge: 'Simple',
    schema: `{
  id: number;
  name: string;
  active: boolean;
}`,
    json: `{
  "id": 1,
  "name": "John Doe",
  "active": true
}`,
  },
  {
    name: 'User with Date',
    schema: `{
  id: number;
  name: string;
  email?: string;
  active: boolean;
  createdAt: Date;
}`,
    json: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true,
  "createdAt": "2023-09-20T12:00:00.000Z"
}`,
  },
  {
    name: 'Array Properties',
    badge: 'Common',
    schema: `{
  userId: number;
  username: string;
  roles: string[];
  permissions: number[];
}`,
    json: `{
  "userId": 42,
  "username": "devuser",
  "roles": ["admin", "editor"],
  "permissions": [1, 3, 5, 7]
}`,
  },
  {
    name: 'Nested Objects',
    schema: `{
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}`,
    json: `{
  "id": 1,
  "name": "John Doe",
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "zipCode": "02108"
  }
}`,
  },
  {
    name: 'API Response',
    badge: 'Real-world',
    schema: `{
  success: boolean;
  status: number;
  data: {
    items: {
      id: number;
      title: string;
      price: number;
    }[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
    };
  };
}`,
    json: `{
  "success": true,
  "status": 200,
  "data": {
    "items": [
      { "id": 1, "title": "Product A", "price": 29.99 },
      { "id": 2, "title": "Product B", "price": 49.99 },
      { "id": 3, "title": "Product C", "price": 19.99 }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "pageSize": 3
    }
  }
}`,
  },
  {
    name: 'Configuration',
    schema: `{
  appName: string;
  version: string;
  features: {
    darkMode: boolean;
    analytics: boolean;
    notifications: boolean;
  };
  limits: {
    maxUploadSize: number;
    maxUsers: number;
  };
}`,
    json: `{
  "appName": "MyApp",
  "version": "1.0.0",
  "features": {
    "darkMode": true,
    "analytics": true,
    "notifications": false
  },
  "limits": {
    "maxUploadSize": 10485760,
    "maxUsers": 50
  }
}`,
  },
  {
    name: 'Mixed Types',
    badge: 'Advanced',
    schema: `{
  id: string;
  metadata: object;
  status: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
}`,
    json: `{
  "id": "user-abc-123",
  "metadata": {
    "source": "api",
    "ipAddress": "192.168.1.1"
  },
  "status": "active",
  "tags": ["premium", "verified"],
  "createdAt": "2023-01-15T08:30:00.000Z"
}`,
  },
  {
    name: 'Auth User',
    schema: `{
  userId: string;
  displayName: string;
  email: string;
  isVerified: boolean;
  role: string;
  lastLogin: Date;
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}`,
    json: `{
  "userId": "auth0|12345",
  "displayName": "Jane Smith",
  "email": "jane@example.com",
  "isVerified": true,
  "role": "admin",
  "lastLogin": "2023-08-28T15:42:30.000Z",
  "preferences": {
    "theme": "dark",
    "language": "en-US",
    "notifications": true
  }
}`,
  },
  // Add new examples
  {
    name: 'Tuple Types',
    badge: 'Advanced',
    schema: `{
  point: [number, number];
  colorRGB: [number, number, number];
  nameAge: [string, number];
}`,
    json: `{
  "point": [10, 20],
  "colorRGB": [255, 128, 0],
  "nameAge": ["John", 30]
}`,
  },
  {
    name: 'Literal Values',
    schema: `{
  status: "active" | "inactive" | "pending";
  priority: 1 | 2 | 3;
  enabled: true;
}`,
    json: `{
  "status": "active",
  "priority": 2,
  "enabled": true
}`,
  },
  {
    name: 'Record Type',
    schema: `{
  settings: Record<string, boolean>;
  scores: Record<string, number>;
}`,
    json: `{
  "settings": {
    "darkMode": true,
    "notifications": false,
    "soundEnabled": true
  },
  "scores": {
    "level1": 95,
    "level2": 82,
    "level3": 76
  }
}`,
  },
  {
    name: 'Refined Types',
    badge: 'Validation',
    schema: `{
  email: string;
  age: number;
  username: string;
}`,
    json: `{
  "email": "user@example.com",
  "age": 25,
  "username": "johndoe123"
}`,
  },
];
