/**
 * 컨설팅 관련 타입 정의
 */

// 1. 시장 & 경쟁 분석
export interface MarketAnalysis {
  marketSize: {
    categoryName: string
    currentSize: {
      value: number
      currency: string
      period: string
    }
    growth: {
      yearOverYear: number
      projection: {
        oneYear: number
        threeYear: number
      }
      cagr: number
    }
    marketTrends: Array<{
      trend: string
      impact: 'positive' | 'negative'
      growthRate: number
    }>
  }
  competitorAnalysis: Array<{
    rank: number
    companyName: string
    marketShare: number
    digitalStrengths: {
      brandRecognition: number
      websiteUX: number
      mobileApp: '매우 우수' | '우수' | '보통' | '부족'
      socialMediaEngagement: number
      contentQuality: number
      customerServiceQuality: number
      conversionRate: number
    }
    marketingStrategy: {
      channels: string[]
      contentThemes: string[]
      campaignFrequency: string
      budgetEstimate: string
    }
    weaknesses: Array<{
      weakness: string
      yourOpportunity: string
      estimatedGain: number
    }>
    threats: Array<{
      threat: string
      impact: 'high' | 'medium' | 'low'
      yourCounterStrategy: string
    }>
  }>
  yourPositioning: {
    currentPosition: {
      marketShare: number
      ranking: number
      strengthAreas: string[]
      weakAreas: string[]
    }
    desiredPosition: {
      targetMarketShare: number
      targetRanking: number
      uniqueValueProposition: string
      differentiation: string[]
    }
    competitiveAdvantage: Array<{
      advantage: string
      defensibility: 'high' | 'medium' | 'low'
      timeToImitate: string
    }>
  }
  opportunities: Array<{
    opportunity: string
    timingWindow: string
    estimatedMarketSize: number
    actionRequired: string
  }>
  threats: Array<{
    threat: string
    likelihood: 'high' | 'medium' | 'low'
    potentialImpact: number
    contingencyPlan: string
  }>
}

// 2. 고객 심리 & 행동 분석
export interface CustomerAnalysis {
  targetProfile: {
    demographics: {
      ageRange: string
      gender: string
      income: string
      location: string[]
      occupation: string[]
    }
    psychographics: {
      lifestyleSegments: Array<{
        segment: string
        size: number
        characteristics: string[]
        spendingPower: 'high' | 'medium' | 'low'
        brandLoyalty: number
      }>
      values: string[]
      motivations: string[]
      fears: string[]
      aspirations: string[]
    }
    digitalBehavior: {
      devicePreference: string
      channelPreferences: Array<{
        channel: string
        usage: number
        purpose: string[]
        trustLevel: number
      }>
      purchaseProcess: {
        awareness: string
        consideration: string
        decision: string
        repurchaseRate: number
      }
    }
  }
  customerJourney: {
    awareness: {
      triggerEvents: Array<{
        event: string
        channel: string
        conversionRate: number
      }>
      painPoints: Array<{
        point: string
        solution: string
      }>
      contentNeeds: string[]
    }
    consideration: {
      informationNeeds: Array<{
        need: string
        source: string[]
        trustImportance: number
      }>
      mainConcerns: Array<{
        concern: string
        concern_rate: number
        resolution: string
      }>
      decisionCriteria: Array<{
        criteria: string
        weight: number
        competitorComparison: Record<string, any>
      }>
    }
    decision: {
      obstacles: Array<{
        obstacle: string
        overcomingStrategy: string
      }>
      finalPushFactors: Array<{
        factor: string
        impact: number
      }>
      abandonmentReasons: Array<{
        reason: string
        preventionStrategy: string
      }>
    }
    retention: {
      expectations: string[]
      delightFactors: string[]
      churnRisks: Array<{
        risk: string
        preventionAction: string
      }>
      loyaltyTriggers: string[]
    }
  }
  psychologicalFactors: {
    socialProof: {
      importance: number
      effectiveness: {
        reviewCount: number
        starRating: number
        userGeneratedContent: number
      }
      tactics: string[]
    }
    scarcity: {
      perception: number
      triggers: string[]
      conversionLift: number
    }
    authority: {
      credibilityFactors: Array<{
        factor: string
        trustLift: number
      }>
    }
    reciprocity: {
      giveStrategies: string[]
      expectedReturn: number
    }
  }
}

// 3. 채널별 상세 전략
export interface ChannelStrategy {
  channels: Array<{
    channelName: string
    channelType: 'social' | 'search' | 'community' | 'direct'
    currentMetrics: {
      followers: number
      engagement: {
        rate: number
        postingFrequency: number
        avgLikes: number
        avgComments: number
        avgShares: number
      }
      reach: {
        monthlyReach: number
        reachTrend: 'up' | 'down' | 'stable'
      }
      conversionMetrics: {
        clickThrough: number
        leadGeneration: number
        sales: number
      }
    }
    benchmark: {
      yourEngagement: number
      topCompetitor: number
      industry: number
      gap: number
      opportunity: string
    }
    goals: {
      shortTerm: {
        timeline: string
        followers: number
        engagement: number
        conversions: number
      }
      mediumTerm: {
        timeline: string
        followers: number
        engagement: number
        conversions: number
      }
    }
    strategy: {
      contentStrategy: {
        pillars: Array<{
          pillar: string
          percentage: number
          formats: string[]
          cadence: string
        }>
        contentCalendar: Array<{
          week: number
          theme: string
          posts: number
          topics: string[]
          estimatedReach: number
        }>
      }
      engagementStrategy: {
        tactics: Array<{
          tactic: string
          target: string
          expectedLift: number
          timeline: string
        }>
        communityManagement: {
          responseTime: string
          answerRate: number
          conversionStrategy: string
        }
      }
      paidStrategy: {
        budget: {
          monthly: number
          allocation: {
            awareness: number
            consideration: number
            conversion: number
          }
        }
        campaigns: Array<{
          campaignName: string
          objective: string
          targetAudience: string
          budget: number
          duration: string
          expectedROI: number
          creativeAssets: string[]
        }>
      }
    }
    weeklyActions: Array<{
      action: string
      owner: string
      deadline: string
      expectedImpact: string
    }>
    successMetrics: {
      primary: {
        metric: string
        target: number
        measurement: string
      }
      secondary: Array<{
        metric: string
        target: number
        measurement: string
      }>
    }
  }>
}

// 4. 실행 계획
export interface DetailedExecutionPlan {
  planningPeriod: {
    startDate: Date
    endDate: Date
    duration: '4주' | '8주' | '12주'
  }
  weeklyPlans: Array<{
    week: number
    weekRange: string
    focus: {
      priority: string
      objective: string
      expectedOutcome: string
    }
    channelActions: Array<{
      channel: string
      actions: Array<{
        actionNumber: number
        task: string
        description: string
        owner: string
        deadline: string
        estimatedHours: number
        budget: number
        expectedImpact: string
        checklist: string[]
      }>
    }>
    dailyActivities: Array<{
      day: string
      activities: Array<{
        time: string
        task: string
        duration: string
      }>
    }>
    resources: {
      team: Array<{
        role: string
        hours: number
      }>
      tools: string[]
      budget: number
    }
    weekReview: {
      metrics: Array<{
        metric: string
        target: number
        actual: number | null
      }>
      successes: string[]
      challenges: string[]
      adjustments: string[]
    }
  }>
  monthlyPlans: Array<{
    month: number
    monthName: string
    focus: string
    milestones: Array<{
      milestone: string
      targetDate: Date
      metrics: Record<string, any>
    }>
  }>
  resourceAllocation: {
    team: Array<{
      role: string
      hours: number
      salary: number
      responsibilities: string[]
    }>
    budget: {
      totalBudget: number
      allocation: {
        content: number
        advertising: number
        tools: number
        testing: number
      }
      breakdown: Array<{
        item: string
        cost: number
        frequency: string
        expectedROI: number
      }>
    }
  }
}

// 5. KPI & 성공 지표
export interface KPIFramework {
  strategicObjectives: Array<{
    objective: string
    timeframe: string
    kpis: Array<{
      kpiName: string
      baseline: number
      target: number
      unit: string
      measurement: {
        frequency: string
        dataSource: string
        owner: string
        method: string
      }
      successPath: {
        month1: number
        month2: number
        month3: number
        month6: number
      }
      redFlag: {
        threshold: number
        action: string
      }
    }>
  }>
  channelKPIs: Array<{
    channel: string
    primaryKPI: {
      metric: string
      baseline: number
      target: number
      weight: number
    }
    supportingKPIs: Array<{
      metric: string
      baseline: number
      target: number
      weight: number
    }>
  }>
  successCriteria: {
    shortTerm: {
      timeline: string
      targets: Array<{
        criterion: string
        importance: 'critical' | 'high' | 'medium'
      }>
      bonus: string
    }
    mediumTerm: {
      timeline: string
      targets: Array<{
        criterion: string
        importance: 'critical' | 'high' | 'medium'
      }>
    }
    longTerm: {
      timeline: string
      targets: Array<{
        criterion: string
        importance: 'critical' | 'high' | 'medium'
      }>
    }
  }
  realtimeDashboard: {
    today: {
      sales: number
      reach: number
      engagement: number
      leads: number
    }
    week: {
      salesTrend: 'up' | 'down' | 'flat'
      reachTrend: string
      weeklyComparison: number
    }
    month: {
      progress: number
      onTrack: boolean
      nextWeekFocus: string
    }
  }
  reviewProcess: {
    frequency: string
    reviewMeeting: {
      day: string
      attendees: string[]
      duration: string
      agenda: string[]
    }
    optimizationCycle: {
      test: string
      analyze: string
      implement: string
      frequency: string
    }
  }
}

// 6. 리스크 관리
export interface RiskManagement {
  identifiedRisks: Array<{
    riskId: number
    riskName: string
    riskCategory: 'market' | 'operational' | 'financial' | 'competitive'
    assessment: {
      likelihood: 'high' | 'medium' | 'low'
      impact: 'critical' | 'high' | 'medium' | 'low'
      severity: number
      occurrenceProbability: number
    }
    description: string
    potentialImpact: {
      revenue: number
      timeline: string
      affectedChannels: string[]
    }
    mitigationStrategies: Array<{
      strategy: string
      actionItems: string[]
      timeline: string
      cost: number
      effectiveness: number
    }>
    contingencyPlan: {
      trigger: string
      immediateActions: string[]
      timeline: string
      contactPerson: string
    }
    monitoring: {
      metric: string
      alertThreshold: number
      checkFrequency: string
      reportTo: string
    }
  }>
  scenarioAnalysis: {
    worstCase: {
      scenario: string
      probability: number
      impact: {
        sales: string
        timeline: string
        cumulativeLoss: number
      }
      responseAction: string
      recoveryTime: string
    }
    bestCase: {
      scenario: string
      probability: number
      impact: {
        sales: string
        timeline: string
      }
    }
    mostLikelyCase: {
      scenario: string
      probability: number
      impact: {
        sales: string
      }
    }
  }
  crisisManagement: {
    crisisTeam: {
      leader: string
      members: string[]
      communicationProtocol: string
    }
    communicationPlan: {
      internalCommunication: string
      customerCommunication: string
      mediaStatement: string
    }
    recoveryPlan: {
      phases: Array<{
        phase: string
        timeline: string
        actions: string[]
      }>
    }
  }
}

// 7. 전략 로드맵
export interface StrategicRoadmap {
  phases: Array<{
    phaseNumber: number
    phaseName: string
    duration: string
    timeline: string
    objectives: Array<{
      objective: string
      rationale: string
      expectedOutcome: string
    }>
    milestones: Array<{
      milestone: string
      targetDate: Date
      metrics: {
        metric: string
        target: number
      }
      owner: string
      dependencies: string[]
    }>
    phaseKPIs: Array<{
      metric: string
      target: number
      status: 'on-track' | 'at-risk' | 'delayed'
    }>
    goLiveChecklist: Array<{
      item: string
      completed: boolean
    }>
  }>
  growthScenarios: {
    conservative: {
      description: string
      assumptions: string[]
      metrics: {
        revenue: number
        marketShare: number
      }
      probability: number
    }
    realistic: {
      description: string
      assumptions: string[]
      metrics: {
        revenue: number
        marketShare: number
      }
      probability: number
    }
    aggressive: {
      description: string
      assumptions: string[]
      metrics: {
        revenue: number
        marketShare: number
      }
      probability: number
    }
  }
  roleBasedRoadmaps: {
    marketingTeam: {
      phase1: string[]
      phase2: string[]
      phase3: string[]
    }
    contentTeam: {
      phase1: string[]
      phase2: string[]
      phase3: string[]
    }
  }
  dependencies: Array<{
    dependency: string
    affectedPhase: number
    risk: string
    mitigation: string
  }>
}

// 8. 투자 분석 & ROI
export interface InvestmentAnalysis {
  investmentPlan: {
    period: string
    costs: {
      teamCosts: {
        marketingDirector: {
          role: string
          months: number
          monthlyCost: number
          totalCost: number
        }
        contentCreators: {
          count: number
          monthlyCost: number
          totalCost: number
        }
        designers: {
          count: number
          monthlyCost: number
          totalCost: number
        }
      }
      advertisingBudget: {
        instagram: number
        youtube: number
        search: number
        total6months: number
      }
      tools: {
        analytics: number
        automation: number
        design: number
        total6months: number
      }
      contentProduction: {
        photography: number
        videography: number
        writing: number
        total6months: number
      }
      contingency: number
    }
    totalInvestment: number
  }
  expectedRevenue: {
    monthlyProjection: Array<{
      month: number
      baseline: number
      increment: number
      projected: number
      confidence: number
    }>
    cumulativeRevenue: {
      month1: number
      month3: number
      month6: number
    }
  }
  roiAnalysis: {
    investmentPeriod: string
    basicROI: {
      investment: number
      revenue: number
      profit: number
      roiPercentage: number
      breakeven: string
    }
    scenarios: {
      conservative: {
        investment: number
        revenue6Month: number
        revenue12Month: number
        roi12Month: number
        breakeven: string
      }
      realistic: {
        investment: number
        revenue6Month: number
        revenue12Month: number
        roi12Month: number
        breakeven: string
      }
      aggressive: {
        investment: number
        revenue6Month: number
        revenue12Month: number
        roi12Month: number
        breakeven: string
      }
    }
    channelROI: Array<{
      channel: string
      investment: number
      revenue: number
      roi: number
      contribution: string
    }>
  }
  costOptimization: {
    areas: Array<{
      area: string
      currentCost: number
      optimizedCost: number
      savings: number
      method: string
      qualityImpact: string
    }>
    totalSavingsPotential: number
  }
  financialPlan: {
    monthlyOutflow: Array<{
      month: number
      expense: number
      budget: number
      variance: number
      notes: string
    }>
    cashFlow: {
      month1: number
      month6: number
      month12: number
    }
  }
  recommendation: {
    verdict: 'GO' | 'NO-GO' | 'PROCEED-WITH-CAUTION'
    rationale: string
    conditions: string[]
    expectedReturn: number
    riskLevel: 'low' | 'medium' | 'high'
  }
}
