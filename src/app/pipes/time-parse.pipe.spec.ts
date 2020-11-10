import { TimeParsePipe } from './time-parse.pipe';

describe('TimeParsePipe', () => {
  it('create an instance', () => {
    const pipe = new TimeParsePipe();
    expect(pipe).toBeTruthy();
  });
});
