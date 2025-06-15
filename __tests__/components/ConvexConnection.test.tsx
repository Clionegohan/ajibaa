import { render, screen } from '@testing-library/react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Home from '@/app/page'

// モッククライアント
const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const MockConvexProvider = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>{children}</ConvexProvider>
);

describe('Convex Connection Test', () => {
  it('should render connection status section', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    const connectionStatus = screen.getByText(/Convex接続状況/i);
    expect(connectionStatus).toBeInTheDocument();
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

  it('should show recipe count loading state', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    const recipeCount = screen.getByText(/レシピ数: 読み込み中.../i);
    expect(recipeCount).toBeInTheDocument();
  });
});