import { validateLogin, validateProfile, validateRegister, type RegisterForm } from '../utils/validation';

const valid: RegisterForm = {
  fullName: 'Asha Patil',
  email: 'asha@example.com',
  gender: 'Female',
  mobile: '9876543210',
  address: '12 MG Road',
  city: 'Pune',
  password: 'secret1',
  confirmPassword: 'secret1',
};

describe('validateRegister', () => {
  it('accepts a fully valid form', () => {
    expect(validateRegister(valid)).toEqual({});
  });

  it('requires every field', () => {
    const errors = validateRegister({
      fullName: '', email: '', gender: '', mobile: '', address: '', city: '', password: '', confirmPassword: '',
    });
    expect(Object.keys(errors).sort()).toEqual(
      ['address', 'city', 'confirmPassword', 'email', 'fullName', 'gender', 'mobile', 'password'].sort(),
    );
  });

  it.each(['plain', 'a@b', 'a b@c.com', '@c.com'])('rejects invalid email "%s"', (email) => {
    expect(validateRegister({ ...valid, email }).email).toBeDefined();
  });

  it('rejects non-numeric mobile numbers', () => {
    expect(validateRegister({ ...valid, mobile: '98765abcde' }).mobile).toMatch(/digits only/i);
  });

  it.each(['123456789', '12345678901'])('requires exactly 10 digits ("%s")', (mobile) => {
    expect(validateRegister({ ...valid, mobile }).mobile).toMatch(/exactly 10/);
  });

  it('requires password of at least 6 characters', () => {
    expect(validateRegister({ ...valid, password: '12345', confirmPassword: '12345' }).password).toBeDefined();
    expect(validateRegister({ ...valid, password: '123456', confirmPassword: '123456' }).password).toBeUndefined();
  });

  it('requires password and confirm password to match', () => {
    expect(validateRegister({ ...valid, confirmPassword: 'different' }).confirmPassword).toMatch(/do not match/i);
  });
});

describe('validateLogin', () => {
  it('requires email and password', () => {
    expect(Object.keys(validateLogin({ email: '', password: '' }))).toEqual(['email', 'password']);
  });
  it('passes with valid input', () => {
    expect(validateLogin({ email: 'a@b.co', password: 'x' })).toEqual({});
  });
});

describe('validateProfile', () => {
  it('reuses the same mobile rules', () => {
    const { fullName, gender, address, city } = valid;
    expect(validateProfile({ fullName, gender, address, city, mobile: '123' }).mobile).toBeDefined();
  });
});
