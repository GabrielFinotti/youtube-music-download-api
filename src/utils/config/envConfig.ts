import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  quiet: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV !== 'production',
});

class EnvConfig {
  private static instance: EnvConfig;

  private _NODE_ENV!: string;
  private _PORT!: number;
  private _CORS!: string;
  private _DOWNLOAD_DIR!: string;
  private _SECRET_KEY!: string;

  private constructor() {
    this.validateEnv();

    this._NODE_ENV = process.env.NODE_ENV!!;
    this._PORT = parseInt(process.env.PORT!!, 10);
    this._CORS = process.env.CORS!!;
    this._DOWNLOAD_DIR = path.join(__dirname, '..', process.env.DOWNLOAD_DIR!!);
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
    if (!process.env.DOWNLOAD_DIR) erros.push('DOWNLOAD_DIR é obrigatório');
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

  get DOWNLOAD_DIR() {
    return this._DOWNLOAD_DIR;
  }

  get SECRET_KEY() {
    return this._SECRET_KEY;
  }
}

export default EnvConfig;
