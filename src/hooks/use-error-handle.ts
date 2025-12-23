import { handleError } from 'src/utils/notify';

export default function useErrorHandle() {

    const handleApiError = async (f: () => Promise<void>, customMsg: string) => {
        try {
            await f();
        } catch (error) {
            handleError(error, customMsg);
        }
    }

    return handleApiError;
}