import { VContainer } from 'vuetify/components';

const ErrorView = () => (
  <VContainer
    class="d-flex flex-column align-center justify-center pa-0 h-100"
    fluid
  >
    404-Not Found
  </VContainer>
);

ErrorView.displayName = 'ErrorView';

export default ErrorView;
