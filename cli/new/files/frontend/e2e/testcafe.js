import { Selector } from 'testcafe';

fixture`Getting Started`
  .page`http://localhost:3000`;

test('My first test', async t => {
  await t 
    .expect(Selector('h1').innerText).eql('Hello World!');
});