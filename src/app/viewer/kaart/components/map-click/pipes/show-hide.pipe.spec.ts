import { ShowHidePipe } from './show-hide.pipe';

describe('ShowHidePipe', () => {
  it('should transfom boolean to "show" or "hide"', () => {
    const pipe = new ShowHidePipe();

    expect(pipe.transform(true)).toEqual('show');
    expect(pipe.transform(false)).toEqual('hide');
  });
});
