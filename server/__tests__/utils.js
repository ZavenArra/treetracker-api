const { knex } = require('../infra/database/knex');

function parsePoint(json) {
  for (const key in json) {
    if (json[key].match && json[key].match(/^POINT\(.*\)$/)) {
      json[key] = knex.raw(`ST_PointFromText('${json[key]}', 4326)`);
    }
  }
  return json;
}

module.exports = {
  async addTree(json) {
    await knex('tree').insert(parsePoint(json)).returning('*');
  },
  async addCapture(json) {
    await knex('capture').insert(parsePoint(json)).returning('*');
  },
  async delTree(id) {
    await knex('tree').where('id', id).del();
  },
  async delCapture(id) {
    await knex('capture').where('id', id).del();
  },
  knex,
};
