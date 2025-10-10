import dotenv from 'dotenv';

dotenv.config({
  quiet: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV !== 'production',
});

class EnvConfig {
  private static instance: EnvConfig;

  private readonly _NODE_ENV!: string;
  private readonly _PORT!: number;
  private readonly _CORS!: string;
  private readonly _VERSION!: string;
  private readonly _SECRET_KEY!: string;

  private constructor() {
    this.validateEnv();

    this._NODE_ENV = process.env.NODE_ENV!!;
    this._PORT = parseInt(process.env.PORT!!, 10);
    this._CORS = process.env.CORS!!;
    this._VERSION = process.env.VERSION!!;
    this._SECRET_KEY = process.env.SECRET_KEY!!;
  }

  static getInstance() {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }

    return EnvConfig.instance;
  }

  private validateEnv() {
    const erros: string[] = [];

    if (!process.env.NODE_ENV) erros.push('NODE_ENV é obrigatório');
    if (!process.env.PORT) erros.push('PORT é obrigatório');
    if (!process.env.CORS) erros.push('CORS é obrigatório');
    if (!process.env.VERSION) erros.push('VERSION é obrigatório');
    if (!process.env.SECRET_KEY) erros.push('SECRET_KEY é obrigatório');

    if (erros.length) {
      throw new Error(
        `Configuração de variáveis de ambiente inválida: ${erros.join(', ')}`
      );
    }
  }

  get NODE_ENV() {
    return this._NODE_ENV;
  }

  get PORT() {
    return this._PORT;
  }

  get CORS() {
    return this._CORS;
  }

  get VERSION() {
    return this._VERSION;
  }

  get SECRET_KEY() {
    return this._SECRET_KEY;
  }
}

export default EnvConfig;
