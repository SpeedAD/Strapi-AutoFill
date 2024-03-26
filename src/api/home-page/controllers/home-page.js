'use strict';

/**
 *  home-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

function formatViewCount(count) {
    if (count < 1000) {
      return count.toString();
    }
    const floorDivisor = count < 1000000 ? 1000 : count < 1000000000 ? 1000000 : 1000000000;
    const suffix = count < 1000000 ? 'K' : count < 1000000000 ? 'M' : 'B';
    const formattedView = (Math.floor(count / floorDivisor / 0.1) * 0.1).toFixed(1) + suffix;
    return formattedView;
  }
  
//custom controller function to fetch visitor counts from Google Analytics API
const propertyId = '336678411';
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const GOOGLE_APPLICATION_CREDENTIALS = "./ga-creds.json"
process.env.GOOGLE_APPLICATION_CREDENTIALS = GOOGLE_APPLICATION_CREDENTIALS
// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

// Runs a simple report.
async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '2022-01-01',
        endDate: 'today',
      },
    ],
    metrics: [
      {
        name: 'newUsers',
      },
    ],
    //shows request token details in response data 
    //returnPropertyQuota: true
  });
  //console.log('Report Result:', response)

  //filtering the response data to extract total view counts
  const responseRows = response.rows;
  let metricsValues = [];
  responseRows.forEach((responseRow) => {
    let metrics = responseRow.metricValues[0];
    metricsValues.push(metrics);
  });
  let viewCounts = "null";
  for (let i = 0; i < metricsValues.length; i++) {
    const value = metricsValues[i].value;
    viewCounts = value;
  }
  return viewCounts;
}

module.exports = createCoreController('api::home-page.home-page', 
({strapi}) => ({
    fetchVisitorCount: async(ctx,next) => {
        if(!ctx.request.body.domainName){
            return {message:"Please Provide the domain name"}
        }
        const domainName = ctx.request.body.domainName
            if(domainName !=="https://letsfighthpv.com/"){
                return ctx.response.status = 401, {message:"Unauthorized Domain"}
                }
                try {
                  const homePage = await strapi.entityService.findOne("api::home-page.home-page",1)
                  const currentTime = Date.now();
                  const updatedAtTime = new Date(homePage.updatedAt)
                  const timeDifferenceInMilliseconds = (currentTime - updatedAtTime);
                  const eightHoursInMilliseconds = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
                  if (timeDifferenceInMilliseconds > eightHoursInMilliseconds) {
                      const newUsers = await runReport();
                      const formattedViews = formatViewCount(newUsers)
                      const updatedHome = await strapi.entityService.update("api::home-page.home-page", 1, {
                          data:{
                              visitor_count:formattedViews
                           }
                        })
                        let updateVisitorCount = updatedHome.visitor_count
                        return {newUsers:updateVisitorCount} 
                    }else{
                        let currentVisitorCount = homePage.visitor_count
                        return {newUsers:currentVisitorCount}
                    }          
                } catch (error) {
                    console.log(error);
                }
      
    },
    async find(ctx){
     ctx.query = {
        filters:{slug: {'$eq':ctx.params.slug}},
        populate:{
            metaData:{
                populate:'*'
            },
            navbar:{
                populate:{
                    hamburger_list:{
                        populate:'*'
                    },
                    social_cta:{
                        populate:'*'
                    },
                    talk_to_expert_cta:{
                        populate:'*'
                    }
                }
            },
            Banner:{
                populate:'*'
            },
            complications:{
                populate:{
                    point_grid:{
                        populate:'*'
                    },
                    points:{
                        populate:'*'
                    },
                    share_cta:{
                        populate:'*'
                    }
                }           
            },
            videoBanner:{
                populate:{
                    play_btn:{
                        populate:'*'
                    },
                    video_mob:{
                        populate:'*'
                    },
                    video_desktop:{
                        populate:'*'
                    }
                }
            },
            overview:{
                populate:{
                    talk_to_expert_cta:{
                        populate:'*'
                    },
                    share_cta:{
                        populate:'*'
                    }
                }
            },
            risks:{
                populate:{
                    risk_talk_to_expert_cta:{
                        populate:'*'
                    },
                    risk_points:{
                        populate:'*'
                    },
                    share_cta:{
                        populate:'*'
                    }
                }
            },
            transmission_one:{
                populate:{
                    row_one_points:{
                        populate:'*'
                    },
                    row_two_points:{
                        populate:'*'
                    }
                }
            },
            transmission_two:{
                populate:{
                    transmission_grid:{
                        populate:'*'
                    },
                    share_cta:{
                        populate:'*'
                    }
                }
            },
            prevntion:{
                populate:{
                    gird_section:{
                        populate:'*'
                    },
                    prevention_cta:{
                        populate:'*'
                    },
                    share_cta:{
                        populate:'*'
                    }
                }
            },
            whoswho:{
                populate:{
                    whoswho_video:{
                        populate:'*'
                    }
                }
            },
            daignosis:{
                populate:{
                    diagnosis_cta:{
                        populate:'*'
                    },
                    silence_holder:{
                        populate:'*'
                    }
                }
            },
            lookAround:{
                populate:'*'
            },
            faq:{
                populate:{
                    qanda:{
                        populate:'*'
                    }
                }
            },
            instagram_feed:{
                populate:{
                    insta_card:{
                        populate:'*'
                    }
                }
            },
            footer:{
                populate:{
                    logo_image:{
                        populate:'*'
                    },
                    footer_social:{
                        populate:'*'
                    },
                    footer_menu:{
                        populate:'*'
                    },
                    footer_reference_points:{
                        populate:'*'
                    },
                    footer_menu_image:{
                        populate:'*'
                    }
                }
            }
        }
    }
    const { data } = await super.find(ctx);
            if(data.length) {
                const sanitizedEntity = await this.sanitizeOutput(data);
                return sanitizedEntity[0];
            }else {
                ctx.status = 404;
                console.log(ctx);
                return ctx.throw(404,"Page not found");
            }
        
}
}));
