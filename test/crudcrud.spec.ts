import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

pactum.reporter.add(SimpleReporter);

const baseUrl = 'https://crudcrud.com/api/b44523c16c0545f6aca7ff8f2afca7c0';
const resource = '/unicorns';
let createdId: string;

describe('API Purpurina de Unicórnio', () => {
  it('Criando um unicórnio', async () => {
    const res = await pactum
      .spec()
      .post(`${baseUrl}${resource}`)
      .withJson({
        name: 'Twilight Sparkle',
        age: 7,
        color: 'roxo'
      })
      .expectStatus(StatusCodes.CREATED)
      .returns('body');
  });

  it('Aceita um unicónio em formação', async () => {
    await pactum
      .spec()
      .post(`${baseUrl}${resource}`)
      .withJson({ name: 'Unicónio transcendente' })
      .expectStatus(StatusCodes.CREATED);
  });

  it('Chamando todos os unicónios', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}${resource}`)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike([{ name: 'Twilight Sparkle' }]);
  });

  it('Unicórnio pelo ID', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}${resource}/${createdId}`)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({ name: 'Twilight Sparkle' });
  });

  it('ID inváido', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}${resource}/invalid-id`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Recriando os unicónios purpurinados', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}${resource}/${createdId}`)
      .withJson({
        name: 'Rainbow Dash',
        age: 5,
        color: 'Blue'
      })
      .expectStatus(StatusCodes.OK);
  });

  it('Atualiza dados incompletos', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}${resource}/${createdId}`)
      .withJson({
        name: 'Novo bebê unicórnio'
      })
      .expectStatus(StatusCodes.OK);
  });

  it('Atualiza ID inválido', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}${resource}/invalid-id`)
      .withJson({
        name: 'Unicónio Fantasma',
        age: 99
      })
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Unicórnio morreu', async () => {
    await pactum
      .spec()
      .delete(`${baseUrl}${resource}/${createdId}`)
      .expectStatus(StatusCodes.OK);
  });

  it('Tente novamente matar o unicórnio morto', async () => {
    await pactum
      .spec()
      .delete(`${baseUrl}${resource}/${createdId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });
});
