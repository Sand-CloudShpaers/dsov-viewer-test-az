import { FloorPipe } from './floor.pipe';

describe('FloorPipe', () => {
  it('create an instance', () => {
    const pipe = new FloorPipe();

    expect(pipe).toBeTruthy();
    expect(pipe.transform(12.1234)).toEqual(12);
  });
});
