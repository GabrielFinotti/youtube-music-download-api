/**
 * Configuração global dos testes
 * Este arquivo é executado antes de todos os testes
 */

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.CORS = '*';
process.env.VERSION = 'v1';
process.env.SECRET_KEY = 'test-secret-key-12345';

// Aumentar timeout padrão para testes que podem ser lentos
jest.setTimeout(10000);

// Silenciar logs durante os testes (opcional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Limpar mocks entre testes
afterEach(() => {
  jest.clearAllMocks();
});
