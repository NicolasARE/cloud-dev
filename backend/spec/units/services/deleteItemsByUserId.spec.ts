import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// mock repository
const removeItemsByUserIdMock = jest.fn<(userId: string) => Promise<void>>();

jest.unstable_mockModule('../../../src/repositories/item', () => ({
    default: {
        removeItemsByUserId: removeItemsByUserIdMock,
    },
}));

const mockSendUserEvent = jest.fn<Promise<void>, [{
    type: 'TODOS_DELETED_SUCCESSFULLY';
    userId: string;
}]>();
jest.unstable_mockModule('../../../src/messaging/kafka/kafka.producer.js', () => ({
    sendUserEvent: mockSendUserEvent,
}));

const { default: service } = await import('../../../src/services/item');

describe('deleteItemsByUserId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('supprime tous les items de l’utilisateur et envoie un événement Kafka', async () => {
        removeItemsByUserIdMock.mockResolvedValue(undefined);
        mockSendUserEvent.mockResolvedValue(undefined);

        await service.deleteItemsByUserId('user-123');

        expect(removeItemsByUserIdMock).toHaveBeenCalledWith('user-123');
        expect(mockSendUserEvent).toHaveBeenCalledWith({
            type: 'TODOS_DELETED_SUCCESSFULLY',
            userId: 'user-123',
        });
    });

    test('propage l’erreur lorsque la suppression échoue', async () => {
        removeItemsByUserIdMock.mockRejectedValue(new Error('DB error'));

        await expect(service.deleteItemsByUserId('user-123')).rejects.toThrow(
            'DB error',
        );

        expect(mockSendUserEvent).not.toHaveBeenCalled();
    });
});
