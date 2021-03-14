import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });

  describe('Validate Password', () => {
    it('Validate password and is correct', async () => {
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
      expect(result).toEqual(true);
    });
    it('Validate password and is false', async () => {
      bcrypt.hash.mockReturnValue('12345');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('1234567');
      expect(bcrypt.hash).toHaveBeenCalledWith('1234567', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
