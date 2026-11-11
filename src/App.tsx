import React, { useState, useEffect } from 'react';
import { TabType, ProjectItem, StudioSettings, ThumbnailState } from './types';
import { 
  getStoredProjects, 
  saveProjects, 
  addProject, 
  deleteProject, 
  getStoredSettings, 
  saveStoredSettings,
  INITIAL_PROJECTS 
} from './utils/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { ThumbnailMaker } from './components/ThumbnailMaker';
import { TitleGenerator } from './components/TitleGenerator';
import { DescriptionGenerator } from './components/DescriptionGenerator';
import { PosterMaker } from './components/PosterMaker';
import { ShortsCreator } from './components/ShortsCreator';
import { LogoBranding } from './components/LogoBranding';
import { MyProjects } from './components/MyProjects';
import { SettingsModal } from './components/SettingsModal';
import { AIImageModal } from './components/AIImageModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [settings, setSettings] = useState<StudioSettings>(getStoredSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiModalTarget, setAiModalTarget] = useState<'thumbnail' | 'poster' | 'shorts' | 'logo'>('thumbnail');

  // Thumbnail Maker State passed into child
  const [thumbnailInitialState, setThumbnailInitialState] = useState<Partial<ThumbnailState>>({
    mainTitle: 'RONALDO VS MBAPPE',
    subtitle: 'WHO IS FASTER IN FC 25?',
    player1: 'CR7',
    player2: 'MBAPPE',
    badge: '99_OVR',
    backgroundTheme: 'cyber_stadium',
  });

  // Load projects from persistent storage on mount
  useEffect(() => {
    const loaded = getStoredProjects();
    setProjects(loaded);
  }, []);

  // Save settings helper
  const handleUpdateSettings = (newSettings: StudioSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Reset sample projects
  const handleResetProjects = () => {
    saveProjects(INITIAL_PROJECTS);
    setProjects(INITIAL_PROJECTS);
  };

  // Add new project
  const handleSaveProject = (item: {
    title: string;
    type: ProjectItem['type'];
    data: any;
    previewUrl?: string;
    dimensions?: string;
  }) => {
    const saved = addProject(item);
    setProjects(getStoredProjects());
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    const updated = deleteProject(id);
    setProjects(updated);
  };

  // Edit project: navigate to the corresponding editor and populate data
  const handleEditProject = (item: ProjectItem) => {
    if (item.type === 'thumbnail') {
      if (item.data) {
        setThumbnailInitialState(item.data);
      }
      setCurrentTab('thumbnails');
    } else if (item.type === 'title') {
      setCurrentTab('titles');
    } else if (item.type === 'description') {
      setCurrentTab('descriptions');
    } else if (item.type === 'poster') {
      setCurrentTab('posters');
    } else if (item.type === 'shorts') {
      setCurrentTab('shorts');
    } else if (item.type === 'logo' || item.type === 'banner') {
      setCurrentTab('branding');
    }
  };

  // Send Title directly to Thumbnail Maker
  const handleUseTitleInThumbnail = (title: string) => {
    setThumbnailInitialState((prev) => ({
      ...prev,
      mainTitle: title.replace(/^[🔥😱⚡\s]+/, '').slice(0, 32).toUpperCase(),
      subtitle: title.slice(32, 70),
    }));
    setCurrentTab('thumbnails');
  };

  // Quick Preset Loader from Home Dashboard
  const handleLoadPresetThumbnail = (presetId: string) => {
    if (presetId === 'preset-weekend-league') {
      setThumbnailInitialState({
        mainTitle: '100-0 UNBEATABLE SQUAD',
        subtitle: 'SECRET META FORMATION REVEALED',
        player1: 'HAALAND',
        player2: 'VINICIUS',
        badge: 'INSANE',
        backgroundTheme: 'red_inferno',
      });
    } else if (presetId === 'preset-secret-pack') {
      setThumbnailInitialState({
        mainTitle: 'SECRET 105 ICON PACK',
        subtitle: 'MY REACTION BROKE THE MIC!',
        player1: 'MESSI',
        player2: 'CR7',
        badge: 'SECRET',
        backgroundTheme: 'gold_glory',
      });
    } else if (presetId === 'preset-90th-winner') {
      setThumbnailInitialState({
        mainTitle: '90TH MIN IMPOSSIBLE GOAL',
        subtitle: 'WORST SCRIPTING EVER?!',
        player1: 'BELLINGHAM',
        player2: 'YAMAL',
        badge: 'NEW_META',
        backgroundTheme: 'neon_arena',
      });
    } else {
      setThumbnailInitialState({
        mainTitle: 'RONALDO VS MBAPPE',
        subtitle: 'WHO IS FASTER IN FC 25?',
        player1: 'CR7',
        player2: 'MBAPPE',
        badge: '99_OVR',
        backgroundTheme: 'cyber_stadium',
      });
    }
  };

  // Open AI modal customized for current tab
  const handleOpenAIModalForTab = () => {
    if (currentTab === 'posters') {
      setAiModalTarget('poster');
    } else if (currentTab === 'shorts') {
      setAiModalTarget('shorts');
    } else if (currentTab === 'branding') {
      setAiModalTarget('logo');
    } else {
      setAiModalTarget('thumbnail');
    }
    setIsAIModalOpen(true);
  };

  // Apply AI image to canvas
  const handleApplyAIImage = (imageUrl: string, targetType: string) => {
    if (targetType === 'thumbnail' || currentTab === 'thumbnails') {
      setThumbnailInitialState((prev) => ({
        ...prev,
        backgroundImage: imageUrl,
      }));
      setCurrentTab('thumbnails');
    }
  };

  return (
    <AndroidFrame isFrameMode={settings.androidFrameMode}>
      {/* Top Android Status Bar */}
      <AndroidStatusBar
        isFrameMode={settings.androidFrameMode}
        onToggleFrameMode={() =>
          handleUpdateSettings({
            ...settings,
            androidFrameMode: !settings.androidFrameMode,
          })
        }
      />

      {/* Studio Header */}
      <Header
        channelName={settings.channelName}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAIModal={handleOpenAIModalForTab}
      />

      {/* Main Studio Views */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentTab === 'home' && (
          <HomeDashboard
            channelName={settings.channelName}
            onNavigate={setCurrentTab}
            onLoadPresetThumbnail={handleLoadPresetThumbnail}
            projects={projects}
            onOpenAIModal={handleOpenAIModalForTab}
          />
        )}

        {currentTab === 'thumbnails' && (
          <ThumbnailMaker
            key={JSON.stringify(thumbnailInitialState)}
            channelName={settings.channelName}
            initialState={thumbnailInitialState}
            onSaveProject={handleSaveProject}
            onOpenAIModal={handleOpenAIModalForTab}
          />
        )}

        {currentTab === 'titles' && (
          <TitleGenerator
            onUseTitleInThumbnail={handleUseTitleInThumbnail}
            onSaveProject={handleSaveProject}
          />
        )}

        {currentTab === 'descriptions' && (
          <DescriptionGenerator
            channelName={settings.channelName}
            onSaveProject={handleSaveProject}
          />
        )}

        {currentTab === 'posters' && (
          <PosterMaker
            channelName={settings.channelName}
            onSaveProject={handleSaveProject}
            onOpenAIModal={handleOpenAIModalForTab}
          />
        )}

        {currentTab === 'shorts' && (
          <ShortsCreator
            channelName={settings.channelName}
            onSaveProject={handleSaveProject}
            onOpenAIModal={handleOpenAIModalForTab}
          />
        )}

        {currentTab === 'branding' && (
          <LogoBranding
            channelName={settings.channelName}
            onSaveProject={handleSaveProject}
            onOpenAIModal={handleOpenAIModalForTab}
          />
        )}

        {currentTab === 'projects' && (
          <MyProjects
            projects={projects}
            onDeleteProject={handleDeleteProject}
            onEditProject={handleEditProject}
            onNavigateTab={setCurrentTab}
          />
        )}
      </main>

      {/* Bottom Android Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        projectCount={projects.length}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProjects={handleResetProjects}
      />

      {/* AI Image Generation Modal */}
      <AIImageModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyImageToCanvas={handleApplyAIImage}
        defaultType={aiModalTarget}
      />
    </AndroidFrame>
  );
}
