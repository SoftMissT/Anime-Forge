interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class Analytics {
  track(event: AnalyticsEvent) {
    // Vercel Analytics (já está instalado!)
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', event.action, {
        category: event.category,
        label: event.label,
        value: event.value
      });
    }
    
    // Log para debug
    console.log('📊 Analytics:', event);
  }
  
  // Helpers específicos
  trackGeneration(category: string, success: boolean, duration: number) {
    this.track({
      category: 'Generation',
      action: success ? 'Success' : 'Failed',
      label: category,
      value: duration
    });
  }
  
  trackFavorite(category: string, action: 'add' | 'remove') {
    this.track({
      category: 'Engagement',
      action: action === 'add' ? 'AddToFavorites' : 'RemoveFromFavorites',
      label: category
    });
  }
  
  trackShare(method: string, itemName: string) {
    this.track({
      category: 'Social',
      action: 'ShareItem',
      label: `${method}: ${itemName}`
    });
  }
}

export const analytics = new Analytics();
