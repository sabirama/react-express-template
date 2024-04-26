import bcrypt from 'bcrypt';

// Function to hash a password
export const hashText = async (plaintext: string) => {
    try {
        const saltRounds = 10; // Number of salt rounds (recommended value is 10)
        const hashedPassword = await bcrypt.hash(plaintext, saltRounds);

        // Truncate the hash to 20 characters
        const truncatedHash = hashedPassword.substring(0, 50);
        console.log(truncatedHash);

        return truncatedHash;
    } catch (error) {
        throw new Error('Error hashing string.');
    }
};

export const compareText = async (plaintext: string, hashedText: string) => {
    try {
        const match = await bcrypt.compare(plaintext, hashedText);
        return match;
    } catch (error) {
        throw new Error('Error comparing strings.');
    }
};