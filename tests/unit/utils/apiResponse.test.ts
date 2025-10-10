import ApiResponse from '../../../src/utils/api/apiResponse';

describe('ApiResponse', () => {
  describe('success', () => {
    it('deve criar uma resposta de sucesso com os dados corretos', () => {
      const data = { id: 1, name: 'Test' };
      const response = ApiResponse.success(200, 'Operação bem-sucedida', data);

      expect(response).toEqual({
        success: true,
        status: 200,
        message: 'Operação bem-sucedida',
        data: { id: 1, name: 'Test' },
      });
    });

    it('deve aceitar diferentes tipos de dados', () => {
      const stringResponse = ApiResponse.success(200, 'String data', 'test');
      expect(stringResponse.data).toBe('test');

      const arrayResponse = ApiResponse.success(200, 'Array data', [1, 2, 3]);
      expect(arrayResponse.data).toEqual([1, 2, 3]);

      const nullResponse = ApiResponse.success(200, 'Null data', null);
      expect(nullResponse.data).toBeNull();
    });

    it('deve ter a propriedade success como true', () => {
      const response = ApiResponse.success(201, 'Created', { id: 1 });
      expect(response.success).toBe(true);
    });
  });

  describe('error', () => {
    it('deve criar uma resposta de erro com status e mensagem', () => {
      const response = ApiResponse.error(400, 'Requisição inválida');

      expect(response).toEqual({
        success: false,
        status: 400,
        error: 'Requisição inválida',
      });
    });

    it('deve incluir detalhes quando fornecidos', () => {
      const response = ApiResponse.error(
        500,
        'Erro interno',
        'Falha ao conectar com o banco de dados'
      );

      expect(response).toEqual({
        success: false,
        status: 500,
        error: 'Erro interno',
        details: 'Falha ao conectar com o banco de dados',
      });
    });

    it('deve ter a propriedade success como false', () => {
      const response = ApiResponse.error(404, 'Não encontrado');
      expect(response.success).toBe(false);
    });

    it('deve aceitar diferentes códigos de status HTTP', () => {
      const badRequest = ApiResponse.error(400, 'Bad Request');
      expect(badRequest.status).toBe(400);

      const notFound = ApiResponse.error(404, 'Not Found');
      expect(notFound.status).toBe(404);

      const serverError = ApiResponse.error(500, 'Server Error');
      expect(serverError.status).toBe(500);
    });
  });
});
