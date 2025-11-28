'use client';

import { useState } from 'react';
import { useInteractions } from './context/InteractionContext';
import {
  HeaderSection,
  ButtonSection,
  InputSection,
  CardSection,
  ModalSection,
  DesignTokensSection,
} from './components/home';

export default function HomePage() {
  const { trackInteraction } = useInteractions();
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | null>(null);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <HeaderSection />

        <ButtonSection onTrackInteraction={trackInteraction} />

        <InputSection
          inputValue={inputValue}
          onInputChange={setInputValue}
          onTrackInteraction={trackInteraction}
        />

        <CardSection onTrackInteraction={trackInteraction} />

        <ModalSection
          modalSize={modalSize}
          onModalSizeChange={setModalSize}
          onTrackInteraction={trackInteraction}
        />

        <DesignTokensSection />
      </div>
    </div>
  );
}
