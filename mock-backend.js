const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const app = express();
const PORT = 3005;

// Mock GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
    cars: [Car]
    members: [Member]
  }

  type Mutation {
    createCar(input: CarInput): Car
    updateCar(id: ID!, input: CarInput): Car
    deleteCar(id: ID!): Boolean
  }

  type Subscription {
    carUpdated: Car
  }

  type Car {
    id: ID!
    brand: String
    model: String
    year: Int
    price: Float
    image: String
  }

  type Member {
    id: ID!
    name: String
    email: String
    phone: String
  }

  input CarInput {
    brand: String
    model: String
    year: Int
    price: Float
    image: String
  }
`;

// Mock data
const cars = [
  { id: '1', brand: 'BMW', model: 'X5', year: 2023, price: 65000, image: '/img/cars/bmw-x7.jpg' },
  { id: '2', brand: 'Mercedes', model: 'S-Class', year: 2023, price: 95000, image: '/img/cars/mercedes-s.jpg' },
  { id: '3', brand: 'Audi', model: 'Q8', year: 2023, price: 75000, image: '/img/cars/audi-q8.jpg' },
];

const members = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321' },
];

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from mock backend!',
    cars: () => cars,
    members: () => members,
  },
  Mutation: {
    createCar: (_, { input }) => {
      const newCar = { id: String(cars.length + 1), ...input };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (_, { id, input }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex === -1) throw new Error('Car not found');
      cars[carIndex] = { ...cars[carIndex], ...input };
      return cars[carIndex];
    },
    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex === -1) return false;
      cars.splice(carIndex, 1);
      return true;
    },
  },
  Subscription: {
    carUpdated: {
      subscribe: () => {
        // Simple subscription - in real app, this would use pubsub
        return {
          [Symbol.asyncIterator]: async function* () {
            while (true) {
              yield { carUpdated: cars[0] };
              await new Promise(resolve => setTimeout(resolve, 5000));
            }
          }
        };
      },
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Mock authentication context
    const token = req.headers.authorization?.replace('Bearer ', '');
    return { token, user: token ? { id: '1', name: 'Mock User' } : null };
  },
});

// Start Apollo Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/'
  });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      console.log('Received:', message.toString());
      ws.send(JSON.stringify({ type: 'pong', data: 'Hello from WebSocket!' }));
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    // Send welcome message
    ws.send(JSON.stringify({ type: 'welcome', data: 'Connected to mock backend!' }));
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Mock backend server running at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  });
}

startServer().catch(console.error);


