import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import ImageUpload from '@/components/ImageUpload'

// モッククライアント
const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>
    {children}
  </ConvexProvider>
);

// Convex mutation のモック
const mockGenerateUploadUrl = jest.fn();
const mockSaveImage = jest.fn();

jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useMutation: jest.fn(() => {
    // 単純に最初にgenerateUploadUrl、次にsaveImageが呼ばれる前提でモック
    return mockGenerateUploadUrl;
  }),
}));

// APIモック
jest.mock('../../convex/_generated/api', () => ({
  api: {
    files: {
      generateUploadUrl: 'generateUploadUrl',
      saveImage: 'saveImage'
    }
  }
}));

// グローバルなfetch APIのモック
const mockFetch = jest.fn();
global.fetch = mockFetch;

// FileReaderのモック
const mockFileReader = {
  readAsDataURL: jest.fn(),
  onload: null as any,
  result: 'data:image/jpeg;base64,mockbase64data'
};

global.FileReader = jest.fn(() => mockFileReader) as any;

describe('ImageUpload Component', () => {
  const mockOnImageUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Phase 3: 段階的実装のモック設定
    const mockUseMutation = require('convex/react').useMutation;
    let callCount = 0;
    mockUseMutation.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // 最初の呼び出し: generateUploadUrl
        return mockGenerateUploadUrl;
      } else {
        // 2番目の呼び出し: saveImage
        return mockSaveImage;
      }
    });
    
    mockGenerateUploadUrl.mockResolvedValue('https://mock-upload-url.com');
    mockSaveImage.mockResolvedValue({
      storageId: 'mock-storage-id',
      url: 'https://mock-image-url.com/image.jpg',
      name: 'test.jpg',
      type: 'image/jpeg',
      size: 1024
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ storageId: 'mock-storage-id' })
    });
  });

  it('should render upload button initially', () => {
    render(
      <TestWrapper>
        <ImageUpload onImageUpload={mockOnImageUpload} />
      </TestWrapper>
    );

    expect(screen.getByText('📸 写真をアップロード')).toBeInTheDocument();
    expect(screen.getByText('クリックして画像を選択')).toBeInTheDocument();
    expect(screen.getByText(/JPEG、PNG、WebP形式/)).toBeInTheDocument();
  });

  it('should show file size limit information', () => {
    render(
      <TestWrapper>
        <ImageUpload onImageUpload={mockOnImageUpload} maxSizeMB={3} />
      </TestWrapper>
    );

    expect(screen.getByText(/3MB以下/)).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <TestWrapper>
        <ImageUpload onImageUpload={mockOnImageUpload} disabled={true} />
      </TestWrapper>
    );

    const uploadButton = screen.getByRole('button');
    expect(uploadButton).toBeDisabled();
  });

  it('should handle file selection and show preview', async () => {
    render(
      <TestWrapper>
        <ImageUpload onImageUpload={mockOnImageUpload} />
      </TestWrapper>
    );

    const fileInput = screen.getByRole('button').parentNode?.querySelector('input[type="file"]') as HTMLInputElement;
    
    const mockFile = new File(['mock image content'], 'test.jpg', {
      type: 'image/jpeg',
      size: 1024
    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });

    // ファイル選択イベントをトリガー
    fireEvent.change(fileInput);

    // FileReader.onloadを手動でトリガー
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mockdata' } } as any);
    }

    await waitFor(() => {
      expect(screen.getByAltText('プレビュー')).toBeInTheDocument();
    });
  });

  it('should validate file size', async () => {
    render(
      <TestWrapper>
        <ImageUpload onImageUpload={mockOnImageUpload} maxSizeMB={1} />
      </TestWrapper>
    );

    const fileInput = screen.getByRole('button').parentNode?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // 2MBのファイル（制限は1MB）
    const largeMockFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
      size: 2 * 1024 * 1024
    });

    Object.defineProperty(fileInput, 'files', {
      value: [largeMockFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText('ファイルサイズは1MB以下にしてください')).toBeInTheDocument();
    });
  });

  it('should validate file type', async () => {
    render(
      <TestWrapper>
        <ImageUpload onImageUpload={mockOnImageUpload} />
      </TestWrapper>
    );

    const fileInput = screen.getByRole('button').parentNode?.querySelector('input[type="file"]') as HTMLInputElement;
    
    const invalidFile = new File(['content'], 'test.txt', {
      type: 'text/plain',
      size: 1024
    });

    Object.defineProperty(fileInput, 'files', {
      value: [invalidFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText('対応していない画像形式です（JPEG、PNG、WebPのみ）')).toBeInTheDocument();
    });
  });

  it('should handle successful upload', async () => {
    render(
      <TestWrapper>
        <ImageUpload onImageUpload={mockOnImageUpload} />
      </TestWrapper>
    );

    const fileInput = screen.getByRole('button').parentNode?.querySelector('input[type="file"]') as HTMLInputElement;
    
    const mockFile = new File(['mock content'], 'test.jpg', {
      type: 'image/jpeg',
      size: 1024
    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    // FileReader.onloadを手動でトリガー
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mockdata' } } as any);
    }

    await waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith(
        'mock-storage-id',
        'https://mock-image-url.com/image.jpg'
      );
    });
  });

  it('should allow removing uploaded image', async () => {
    render(
      <TestWrapper>
        <ImageUpload onImageUpload={mockOnImageUpload} />
      </TestWrapper>
    );

    const fileInput = screen.getByRole('button').parentNode?.querySelector('input[type="file"]') as HTMLInputElement;
    
    const mockFile = new File(['mock content'], 'test.jpg', {
      type: 'image/jpeg',
      size: 1024
    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    // FileReader.onloadを手動でトリガー
    await act(async () => {
      if (mockFileReader.onload) {
        mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mockdata' } } as any);
      }
    });

    await waitFor(() => {
      expect(screen.getByAltText('プレビュー')).toBeInTheDocument();
    });

    // 削除ボタンをクリック
    const removeButton = screen.getByText('×');
    
    await act(async () => {
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(screen.queryByAltText('プレビュー')).not.toBeInTheDocument();
      expect(screen.getByText('📸 写真をアップロード')).toBeInTheDocument();
    });
  });
});