import TradingViewWidgets from '@/components/TradingViewWidgets'
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from '@/lib/constants'
import React from 'react'

function Home() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`

  return (
    <div className='flex min-h-screen home-wrapper'>
      <section className='grid w-full gap-8 home-section'>
        <div className='md:col-span-1 xl:col-span-1'>
          <TradingViewWidgets
            title='Market Overview'
            scriptUrl={`${scriptUrl}market-overview.js`}
            height={600}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className='custom-chart'
          />
        </div>
        <div className='md:col-span-1 xl:col-span-2'>
          <TradingViewWidgets
            title='Stock Heatmap'
            scriptUrl={`${scriptUrl}stock-heatmap.js`}
            height={600}
            config={HEATMAP_WIDGET_CONFIG}
            className='custom-chart'
          />
        </div>
      </section>
      <section className='grid w-full gap-8 home-section'>
        <div className='h-full md:col-span-1 xl:col-span-1'>
          <TradingViewWidgets
            scriptUrl={`${scriptUrl}timeline.js`}
            height={600}
            config={TOP_STORIES_WIDGET_CONFIG}
          />
        </div>
        <div className='h-full md:col-span-1 xl:col-span-2'>
          <TradingViewWidgets
            scriptUrl={`${scriptUrl}market-quotes.js`}
            height={600}
            config={MARKET_DATA_WIDGET_CONFIG}
          />
        </div>
      </section>
    </div>
  )
}

export default Home
