const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const grower_account1 = require('../../mock/grower_account1.json');
const grower_account2 = require('../../mock/grower_account2.json');
const { knex } = require('../../utils');

describe('/grower_account', () => {
  const growerAccountUpdates = {
    person_id: 'df9541b7-4bf4-4c8b-8711-f42f66bc50cc',
    name: 'name',
    email: 'name@email.com',
    phone: '1234567',
    image_url: 'https://www.himage.com',
    image_rotation: 44,
  };

  after(async () => {
    await knex('grower_account')
      .where({
        ...grower_account1,
        ...growerAccountUpdates,
        name: grower_account2.name,
        email: grower_account2.email,
        phone: grower_account2.phone,
      })
      .del();
  });

  describe('POST', () => {
    it('should create a grower account', async () => {
      await request(app)
        .post(`/grower_accounts`)
        .send(grower_account1)
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should not error out if duplicate id is sent', async () => {
      await request(app)
        .post(`/grower_accounts`)
        .send(grower_account1)
        .set('Accept', 'application/json')
        .expect(204);
    });
  });

  describe('PATCH', () => {
    it('should uodate a grower account', async () => {
      await request(app)
        .patch(`/grower_accounts/${grower_account1.id}`)
        .send(growerAccountUpdates)
        .set('Accept', 'application/json')
        .expect(204);
    });
  });

  describe('GET', () => {
    it('should get a single grower account', async () => {
      const result = await request(app)
        .get(`/grower_accounts/${grower_account1.id}`)
        .expect(200);
      expect(result.body).to.include({
        ...grower_account1,
        ...growerAccountUpdates,
      });
    });

    it('should get grower account', async () => {
      const result = await request(app).get(`/grower_accounts`).expect(200);
      expect(result.body.grower_accounts.length).to.eql(1);
      expect(result.body.links).to.have.keys(['prev', 'next']);
      expect(result.body.grower_accounts[0]).to.include({
        ...grower_account1,
        ...growerAccountUpdates,
      });
    });

    it('should delete a grower account', async () => {
      await request(app)
        .patch(`/grower_accounts/${grower_account1.id}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should get grower account --should be empty', async () => {
      const result = await request(app).get(`/grower_accounts`).expect(200);
      expect(result.body.grower_accounts.length).to.eql(0);
      expect(result.body.links).to.have.keys(['prev', 'next']);
    });
  });

  describe('PUT', () => {
    it('should update a grower account with the same wallet', async () => {
      await request(app)
        .put(`/grower_accounts`)
        .send(grower_account2)
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should get a single grower account-- result should include "put updated" values', async () => {
      const result = await request(app)
        .get(`/grower_accounts/${grower_account1.id}`)
        .expect(200);
      expect(result.body).to.include({
        ...grower_account1,
        ...growerAccountUpdates,
        name: grower_account2.name,
        email: grower_account2.email,
        phone: grower_account2.phone,
      });
    });
  });
});
