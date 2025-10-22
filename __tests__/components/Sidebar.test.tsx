import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from '../../components/common/Sidebar';
import { dummyDomain } from '../../__mocks__/data';
import { DEFAULT_BRANDING } from '../../utils/branding';
import { useBranding } from '../../hooks/useBranding';

const addDomainMock = jest.fn();

jest.mock('../../hooks/useBranding');
jest.mock('next/router', () => jest.requireActual('next-router-mock'));

const mockUseBranding = useBranding as jest.MockedFunction<typeof useBranding>;

describe('Sidebar Component', () => {
   beforeEach(() => {
      mockUseBranding.mockReturnValue({
         branding: DEFAULT_BRANDING,
         isLoading: false,
         isError: false,
         isFetching: false,
         refetch: jest.fn(),
      });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('renders without crashing', async () => {
       render(<Sidebar domains={[dummyDomain]} showAddModal={addDomainMock} />);
       expect(screen.getByText(DEFAULT_BRANDING.platformName)).toBeInTheDocument();
   });
   it('renders domain list', async () => {
      render(<Sidebar domains={[dummyDomain]} showAddModal={addDomainMock} />);
      expect(screen.getByText('compressimage.io')).toBeInTheDocument();
   });
   it('calls showAddModal on Add Domain button click', async () => {
      render(<Sidebar domains={[dummyDomain]} showAddModal={addDomainMock} />);
      const addDomainBtn = screen.getByTestId('add_domain');
      fireEvent.click(addDomainBtn);
      expect(addDomainMock).toHaveBeenCalledWith(true);
   });
});
