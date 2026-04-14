import { describe, test, expect } from '@jest/globals';

describe("Placeholder", () => {

    test("placholder test", async () => {
        // Arrange
        const a = 3;
        const b = 2;

        // Act
        const c = a + b;

        // Assert
        expect(c).toBe(5);
    });

});