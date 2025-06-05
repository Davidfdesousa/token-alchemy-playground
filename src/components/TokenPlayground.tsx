
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Brand = 'tech' | 'nature' | 'creative';
type Theme = 'light' | 'dark' | 'contrast';

const TokenPlayground = () => {
  const [currentBrand, setCurrentBrand] = useState<Brand>('tech');
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  const tokens = {
    tech: {
      light: {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        surface: '#ffffff',
        text: '#111827',
        background: '#eff6ff'
      },
      dark: {
        primary: '#60a5fa',
        primaryHover: '#93c5fd',
        surface: '#1f2937',
        text: '#ffffff',
        background: '#111827'
      },
      contrast: {
        primary: '#1e3a8a',
        primaryHover: '#1e40af',
        surface: '#ffffff',
        text: '#000000',
        background: '#dbeafe'
      }
    },
    nature: {
      light: {
        primary: '#22c55e',
        primaryHover: '#16a34a',
        surface: '#ffffff',
        text: '#111827',
        background: '#f0fdf4'
      },
      dark: {
        primary: '#4ade80',
        primaryHover: '#86efac',
        surface: '#1f2937',
        text: '#ffffff',
        background: '#111827'
      },
      contrast: {
        primary: '#14532d',
        primaryHover: '#166534',
        surface: '#ffffff',
        text: '#000000',
        background: '#dcfce7'
      }
    },
    creative: {
      light: {
        primary: '#a855f7',
        primaryHover: '#9333ea',
        surface: '#ffffff',
        text: '#111827',
        background: '#faf5ff'
      },
      dark: {
        primary: '#c084fc',
        primaryHover: '#d8b4fe',
        surface: '#1f2937',
        text: '#ffffff',
        background: '#111827'
      },
      contrast: {
        primary: '#581c87',
        primaryHover: '#6b21a8',
        surface: '#ffffff',
        text: '#000000',
        background: '#f3e8ff'
      }
    }
  };

  const currentTokens = tokens[currentBrand][currentTheme];

  return (
    <div 
      className="min-h-screen p-8 transition-colors duration-300"
      style={{ backgroundColor: currentTokens.background }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 
            className="text-4xl font-bold"
            style={{ color: currentTokens.text }}
          >
            Style Dictionary Playground
          </h1>
          <p 
            className="text-lg opacity-80"
            style={{ color: currentTokens.text }}
          >
            Explore design tokens across different brands and themes
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="space-y-2">
            <label 
              className="text-sm font-medium block"
              style={{ color: currentTokens.text }}
            >
              Brand
            </label>
            <Select value={currentBrand} onValueChange={(value: Brand) => setCurrentBrand(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label 
              className="text-sm font-medium block"
              style={{ color: currentTokens.text }}
            >
              Theme
            </label>
            <Select value={currentTheme} onValueChange={(value: Theme) => setCurrentTheme(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="contrast">Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Token Display */}
        <Card 
          className="p-6"
          style={{ 
            backgroundColor: currentTokens.surface,
            color: currentTokens.text
          }}
        >
          <h2 className="text-2xl font-semibold mb-4">Current Tokens</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(currentTokens).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div 
                  className="w-full h-12 rounded border-2"
                  style={{ backgroundColor: value, borderColor: currentTokens.text + '20' }}
                />
                <div className="text-sm">
                  <div className="font-medium">{key}</div>
                  <div className="opacity-70 font-mono text-xs">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Component Examples */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buttons */}
          <Card 
            className="p-6"
            style={{ 
              backgroundColor: currentTokens.surface,
              color: currentTokens.text
            }}
          >
            <h3 className="text-xl font-semibold mb-4">Buttons</h3>
            <div className="space-y-4">
              <button
                className="px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: currentTokens.primary,
                  color: currentTokens.surface
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTokens.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTokens.primary;
                }}
              >
                Primary Button
              </button>
              
              <button
                className="px-6 py-3 rounded-lg font-medium border-2 transition-colors duration-200"
                style={{
                  color: currentTokens.primary,
                  borderColor: currentTokens.primary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTokens.primary;
                  e.currentTarget.style.color = currentTokens.surface;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = currentTokens.primary;
                }}
              >
                Secondary Button
              </button>
            </div>
          </Card>

          {/* Cards */}
          <Card 
            className="p-6"
            style={{ 
              backgroundColor: currentTokens.surface,
              color: currentTokens.text
            }}
          >
            <h3 className="text-xl font-semibold mb-4">Card Examples</h3>
            <div className="space-y-4">
              <div 
                className="p-4 rounded-xl border"
                style={{ 
                  backgroundColor: currentTokens.background,
                  borderColor: currentTokens.primary + '30'
                }}
              >
                <h4 className="font-semibold mb-2">Feature Card</h4>
                <p className="text-sm opacity-80">
                  This card demonstrates how tokens work across different themes and brands.
                </p>
              </div>
              
              <div 
                className="p-4 rounded-xl shadow-lg"
                style={{ 
                  backgroundColor: currentTokens.primary + '10',
                  border: `1px solid ${currentTokens.primary}30`
                }}
              >
                <h4 className="font-semibold mb-2">Highlighted Card</h4>
                <p className="text-sm opacity-80">
                  Using primary color variants for emphasis.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Typography Examples */}
        <Card 
          className="p-6"
          style={{ 
            backgroundColor: currentTokens.surface,
            color: currentTokens.text
          }}
        >
          <h3 className="text-xl font-semibold mb-4">Typography</h3>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Heading 1 - 32px</h1>
            <h2 className="text-2xl font-semibold">Heading 2 - 24px</h2>
            <h3 className="text-xl font-medium">Heading 3 - 20px</h3>
            <p className="text-base">Body text - 16px. This is regular paragraph text using the base font size token.</p>
            <p className="text-sm opacity-80">Small text - 14px. Used for captions and secondary information.</p>
          </div>
        </Card>

        {/* Brand Info */}
        <Card 
          className="p-6"
          style={{ 
            backgroundColor: currentTokens.surface,
            color: currentTokens.text
          }}
        >
          <h3 className="text-xl font-semibold mb-4">Current Configuration</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Brand:</strong> {currentBrand.charAt(0).toUpperCase() + currentBrand.slice(1)}
            </div>
            <div>
              <strong>Theme:</strong> {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
            </div>
            <div>
              <strong>Primary Color:</strong> {currentTokens.primary}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TokenPlayground;
