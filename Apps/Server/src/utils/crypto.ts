import bcrypt from 'bcrypt';

export const isPasswordValid = async (password: string, hashedPassword: string) => {
  const isValid = await new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, isEqualAfterHash) => {
          if (err) {
              resolve(false);
              return;
          }

          if (!isEqualAfterHash) {
              resolve(false);
              return;
          }

          resolve(true);
      });
  });

  return isValid;
}