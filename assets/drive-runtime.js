(function (global) {
  'use strict';

  const KEYS = Object.freeze({
    engagementId: 'drive_engagement_id',
    engagementName: 'drive_engagement_name',
    engagementIndustry: 'drive_engagement_industry',
  });

  const TOOL_URLS = Object.freeze({
    hub: '/hub.html', discover: '/discover.html', resolve: '/resolve.html',
    intuit: '/intuit.html', visualize: '/visualize.html', execute: '/execute.html',
  });

  const UPSTREAM_TABLES = Object.freeze({
    discover: 'org_discover', resolve: 'org_taxonomy', intuit: 'org_intelligence',
    visualize: 'org_vec_state', execute: 'org_engine_assets',
  });

  function safeLocalStorage() {
    try { return global.localStorage; } catch (_) { return null; }
  }

  function readLocal(key) {
    try { return safeLocalStorage()?.getItem(key) || ''; } catch (_) { return ''; }
  }

  function writeLocal(key, value) {
    if (value === undefined || value === null || value === '') return;
    try { safeLocalStorage()?.setItem(key, String(value)); } catch (_) {}
  }

  function createAuth(supabase) {
    return Object.freeze({
      getSession: () => supabase.auth.getSession(),
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      resetPassword: (email) => supabase.auth.resetPasswordForEmail(email, { redirectTo: global.location.origin + '/hub.html' }),
      signOut: () => supabase.auth.signOut(),
      onChange: (handler) => supabase.auth.onAuthStateChange(handler),
    });
  }

  function createStore(supabase, tool) {
    return {
      orgId: null,
      userEmail: null,
      session: null,
      tool,
      context: null,

      init(session) {
        this.session = session || null;
        this.userEmail = session?.user?.email || '';
        const engagementId = readLocal(KEYS.engagementId);
        this.orgId = engagementId || this.userEmail || 'default';
        if (engagementId && tool) writeLocal('drive_last_tool_' + engagementId, tool);
        return this.orgId;
      },

      async save(table, data) {
        if (!this.orgId) return { data: null, error: new Error('DRIVE store is not initialized') };
        return supabase.from(table).upsert({
          org_id: this.orgId,
          data,
          updated_at: new Date().toISOString(),
          updated_by: this.userEmail,
        }, { onConflict: 'org_id' });
      },

      async load(table) {
        if (!this.orgId) return null;
        try {
          const { data, error } = await supabase.from(table).select('data').eq('org_id', this.orgId).maybeSingle();
          if (error || !data) return null;
          return data.data;
        } catch (_) { return null; }
      },

      async resolveContext(session) {
        const activeSession = session || this.session;
        if (!this.orgId) this.init(activeSession);
        const user = activeSession?.user || null;
        const engagementId = readLocal(KEYS.engagementId) || null;
        let engagement = null;
        let members = [];
        let isAdmin = false;
        const upstream = {};

        if (user) {
          try {
            const { data } = await supabase.from('drive_admins').select('user_id').eq('user_id', user.id).maybeSingle();
            isAdmin = !!data;
          } catch (_) {}
        }

        if (engagementId) {
          const presenceRequests = Object.entries(UPSTREAM_TABLES).map(async ([phase, table]) => {
            try {
              const { data } = await supabase.from(table).select('org_id').eq('org_id', engagementId).maybeSingle();
              upstream[phase] = !!data;
            } catch (_) { upstream[phase] = false; }
          });
          const engagementRequest = (async () => {
            try {
              const { data } = await supabase.from('drive_engagements')
                .select('id, owner_email, client_name, org_name, industry, size_tier, contact_name, contact_email, status')
                .eq('id', engagementId).maybeSingle();
              engagement = data || null;
            } catch (_) {}
          })();
          const membersRequest = (async () => {
            try {
              const { data } = await supabase.from('drive_engagement_members')
                .select('id, email, user_id').eq('engagement_id', engagementId);
              members = data || [];
            } catch (_) {}
          })();
          await Promise.all([engagementRequest, membersRequest, ...presenceRequests]);
        }

        const organizationName = engagement?.org_name || engagement?.client_name || readLocal(KEYS.engagementName) || '';
        const industry = engagement?.industry || readLocal(KEYS.engagementIndustry) || '';
        if (engagement) {
          writeLocal(KEYS.engagementName, engagement.client_name || engagement.org_name);
          writeLocal(KEYS.engagementIndustry, industry);
        }

        this.context = Object.freeze({
          engagementId,
          organizationName,
          clientName: engagement?.client_name || readLocal(KEYS.engagementName) || '',
          industry,
          sizeTier: engagement?.size_tier || '',
          contact: Object.freeze({ name: engagement?.contact_name || '', email: engagement?.contact_email || '' }),
          ownerEmail: engagement?.owner_email || '',
          status: engagement?.status || '',
          permissions: Object.freeze({
            isAuthenticated: !!user,
            isAdmin,
            isOwner: !!user && engagement?.owner_email === user.email,
            isMember: !!user && members.some(member => member.user_id === user.id || member.email === user.email),
          }),
          upstream: Object.freeze(upstream),
        });
        return this.context;
      },
    };
  }

  function navigate(tool, engagementId) {
    const url = TOOL_URLS[tool];
    if (!url) throw new Error('Unknown DRIVE tool: ' + tool);
    if (engagementId) writeLocal(KEYS.engagementId, engagementId);
    global.location.href = url;
  }

  global.DRIVE = Object.freeze({
    KEYS,
    TOOL_URLS,
    UPSTREAM_TABLES,
    createAuth,
    createStore,
    navigate,
    readLocal,
  });
})(window);
