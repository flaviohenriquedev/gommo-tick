import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tickRequestService } from "../services/tickRequest.service";
import type { TickRequestSubmissionDto } from "../types/tickRequest.types";

export const tickRequestKeys = {
    all: ["tick-requests"] as const,
    pages: () => [...tickRequestKeys.all, "page"] as const
};

export function useSubmitTickRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: TickRequestSubmissionDto) => tickRequestService.submit(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tickRequestKeys.all });
        }
    });
}
