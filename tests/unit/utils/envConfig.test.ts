import EnvConfig from '../../../src/utils/config/envConfig';

describe('EnvConfig', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Salvar as variáveis de ambiente originais
    originalEnv = { ...process.env };

    // Resetar a instância do singleton para cada teste
    // @ts-ignore - acessando propriedade privada para reset nos testes
    EnvConfig.instance = undefined;
  });

  afterEach(() => {
    // Restaurar as variáveis de ambiente originais
    process.env = originalEnv;
  });

  describe('getInstance', () => {
    it('deve retornar sempre a mesma instância (Singleton)', () => {
      const instance1 = EnvConfig.getInstance();
      const instance2 = EnvConfig.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('validateEnv', () => {
    it('deve validar com sucesso todas as variáveis de ambiente', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '3000';
      process.env.CORS = '*';
      process.env.VERSION = 'v1';
      process.env.SECRET_KEY = 'test-secret';

      expect(() => EnvConfig.getInstance()).not.toThrow();
    });

    it('deve lançar erro quando NODE_ENV não estiver definido', () => {
      delete process.env.NODE_ENV;
      process.env.PORT = '3000';
      process.env.CORS = '*';
      process.env.VERSION = 'v1';
      process.env.SECRET_KEY = 'test-secret';

      expect(() => EnvConfig.getInstance()).toThrow(
        'Configuração de variáveis de ambiente inválida: NODE_ENV é obrigatório'
      );
    });

    it('deve lançar erro quando PORT não estiver definido', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.PORT;
      process.env.CORS = '*';
      process.env.VERSION = 'v1';
      process.env.SECRET_KEY = 'test-secret';

      expect(() => EnvConfig.getInstance()).toThrow(
        'Configuração de variáveis de ambiente inválida: PORT é obrigatório'
      );
    });

    it('deve lançar erro quando CORS não estiver definido', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '3000';
      delete process.env.CORS;
      process.env.VERSION = 'v1';
      process.env.SECRET_KEY = 'test-secret';

      expect(() => EnvConfig.getInstance()).toThrow(
        'Configuração de variáveis de ambiente inválida: CORS é obrigatório'
      );
    });

    it('deve lançar erro quando VERSION não estiver definido', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '3000';
      process.env.CORS = '*';
      delete process.env.VERSION;
      process.env.SECRET_KEY = 'test-secret';

      expect(() => EnvConfig.getInstance()).toThrow(
        'Configuração de variáveis de ambiente inválida: VERSION é obrigatório'
      );
    });

    it('deve lançar erro quando SECRET_KEY não estiver definido', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '3000';
      process.env.CORS = '*';
      process.env.VERSION = 'v1';
      delete process.env.SECRET_KEY;

      expect(() => EnvConfig.getInstance()).toThrow(
        'Configuração de variáveis de ambiente inválida: SECRET_KEY é obrigatório'
      );
    });

    it('deve lançar erro com múltiplas variáveis faltando', () => {
      delete process.env.NODE_ENV;
      delete process.env.PORT;
      process.env.CORS = '*';
      process.env.VERSION = 'v1';
      process.env.SECRET_KEY = 'test-secret';

      expect(() => EnvConfig.getInstance()).toThrow(
        'Configuração de variáveis de ambiente inválida'
      );
      expect(() => EnvConfig.getInstance()).toThrow('NODE_ENV é obrigatório');
      expect(() => EnvConfig.getInstance()).toThrow('PORT é obrigatório');
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.PORT = '8080';
      process.env.CORS = 'https://example.com';
      process.env.VERSION = 'v2';
      process.env.SECRET_KEY = 'my-secret-key';
    });

    it('deve retornar NODE_ENV corretamente', () => {
      const config = EnvConfig.getInstance();
      expect(config.NODE_ENV).toBe('production');
    });

    it('deve retornar PORT como número', () => {
      const config = EnvConfig.getInstance();
      expect(config.PORT).toBe(8080);
      expect(typeof config.PORT).toBe('number');
    });

    it('deve retornar CORS corretamente', () => {
      const config = EnvConfig.getInstance();
      expect(config.CORS).toBe('https://example.com');
    });

    it('deve retornar VERSION corretamente', () => {
      const config = EnvConfig.getInstance();
      expect(config.VERSION).toBe('v2');
    });

    it('deve retornar SECRET_KEY corretamente', () => {
      const config = EnvConfig.getInstance();
      expect(config.SECRET_KEY).toBe('my-secret-key');
    });
  });

  describe('edge cases', () => {
    it('deve converter PORT para número inteiro', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '3000.5'; // número decimal
      process.env.CORS = '*';
      process.env.VERSION = 'v1';
      process.env.SECRET_KEY = 'test-secret';

      const config = EnvConfig.getInstance();
      expect(config.PORT).toBe(3000); // deve truncar
    });

    it('deve aceitar diferentes valores de NODE_ENV', () => {
      const environments = ['development', 'test', 'production', 'staging'];

      environments.forEach((env) => {
        process.env.NODE_ENV = env;
        process.env.PORT = '3000';
        process.env.CORS = '*';
        process.env.VERSION = 'v1';
        process.env.SECRET_KEY = 'test-secret';

        // @ts-ignore - resetar instância
        EnvConfig.instance = undefined;

        const config = EnvConfig.getInstance();
        expect(config.NODE_ENV).toBe(env);
      });
    });
  });
});
