import {
  formatingActivity,
  activityFromFetch,
} from '../data/seedding/activities.seeding';

// describe('Formating activity function test series', () => {
//   test('It should return', () => {
//     expect(formatingActivity(activityFromFetch, 2, 2478)).toHaveReturned();
//   })
// })

describe('Formated activity test series', () => {
  let formatedActivity = '';
  beforeAll(async () => {
    formatedActivity = await formatingActivity(activityFromFetch, 2, 2478);
  });

  console.log(formatedActivity);

  test('It should return an object', () => {
    expect(typeof formatedActivity).toBe('object');
  });

  test('It should return 11 properties in the object', () => {
    expect(Object.entries(formatedActivity)).toHaveLength(11);
  });

  test('It should have right properties', () => {
    expect(formatedActivity).toHaveProperty('slug');
    expect(formatedActivity).toHaveProperty('title');
    expect(formatedActivity).toHaveProperty('description');
    expect(formatedActivity).toHaveProperty('url_image');
    expect(formatedActivity).toHaveProperty('address');
    expect(formatedActivity).toHaveProperty('phone');
    expect(formatedActivity).toHaveProperty('avg_rating');
    expect(formatedActivity).toHaveProperty('latitude');
    expect(formatedActivity).toHaveProperty('longitude');
    expect(formatedActivity).toHaveProperty('id_user');
    expect(formatedActivity).toHaveProperty('id_city');
  });

  test('They should be a string', () => {
    expect(typeof formatedActivity.slug).toBe('string');
    expect(typeof formatedActivity.title).toBe('string');
    expect(typeof formatedActivity.description).toBe('string');
    expect(typeof formatedActivity.url_image).toBe('string');
    expect(typeof formatedActivity.address).toBe('string');
    expect(typeof formatedActivity.phone).toBe('string');
  });

  test('They should be a number', () => {
    expect(typeof formatedActivity.avg_rating).toBe('number');
    expect(typeof formatedActivity.latitude).toBe('number');
    expect(typeof formatedActivity.longitude).toBe('number');
    expect(typeof formatedActivity.id_user).toBe('number');
    expect(typeof formatedActivity.id_city).toBe('number');
  });
});
