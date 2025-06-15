import { render, screen } from '@testing-library/react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Home from '@/app/page'

// モッククライアント
const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const MockConvexProvider = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>{children}</ConvexProvider>
);

describe('Convex Connection Test', () => {
  it('should render development status section', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    const developmentStatus = screen.getByText(/開発状況/i);
    expect(developmentStatus).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    const loadingText = screen.getByText(/接続中.../i);
    expect(loadingText).toBeInTheDocument();
  });

  it('should show data source information', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    const dataSource = screen.getByText(/データソース: サンプルデータ/i);
    expect(dataSource).toBeInTheDocument();
  });
});