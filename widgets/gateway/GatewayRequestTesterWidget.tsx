import React from "react";
import { HttpMethod, GatewayTestResponse } from "@/entities/gateway/model/types";
import { RequestTesterForm } from "@/features/gateway/request-tester/ui/RequestTesterForm";
import { ResponseViewer } from "@/features/gateway/request-tester/ui/ResponseViewer";

interface GatewayRequestTesterWidgetProps {
  method: HttpMethod;
  onMethodChange: (method: HttpMethod) => void;
  endpoint: string;
  onEndpointChange: (endpoint: string) => void;
  authHeader: string;
  onAuthHeaderChange: (header: string) => void;
  payload: string;
  onPayloadChange: (payload: string) => void;
  isTesting: boolean;
  onRunTest: () => void;
  response: GatewayTestResponse | null;
}

export const GatewayRequestTesterWidget: React.FC<GatewayRequestTesterWidgetProps> = ({
  method,
  onMethodChange,
  endpoint,
  onEndpointChange,
  authHeader,
  onAuthHeaderChange,
  payload,
  onPayloadChange,
  isTesting,
  onRunTest,
  response,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RequestTesterForm
        method={method}
        onMethodChange={onMethodChange}
        endpoint={endpoint}
        onEndpointChange={onEndpointChange}
        authHeader={authHeader}
        onAuthHeaderChange={onAuthHeaderChange}
        payload={payload}
        onPayloadChange={onPayloadChange}
        isTesting={isTesting}
        onSubmit={onRunTest}
      />
      <ResponseViewer response={response} />
    </div>
  );
};
