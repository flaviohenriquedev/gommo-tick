import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tickRequestService } from "../services/tickRequest.service";
import type { TickRequestSubmissionDto } from "../types/tickRequest.types";

export const tickRequestKeys = {
    all: ["tick-requests"] as const,
    pages: () => [...tickRequestKeys.all, "page"] as const,
    mobileSubmissions: (from?: string, to?: string) =>
        [...tickRequestKeys.all, "mobile-submissions", from ?? "", to ?? ""] as const
};

export function useTickRequests(from?: string, to?: string) {
    return useQuery({
        queryKey: tickRequestKeys.mobileSubmissions(from, to),
        queryFn: () => tickRequestService.getMobileSubmissions(from, to)
    });
}

export function useSubmitTickRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: TickRequestSubmissionDto) => tickRequestService.submit(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tickRequestKeys.all });
        }
    });
}
