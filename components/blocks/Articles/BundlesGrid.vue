<script setup lang="ts">
const items = [
  {
    id: '1',
    href: '/',
  },
]
</script>

<template>
  <ul class="popular-bundle">
    <li v-for="item in items" :key="item.id" class="popular-bundle-list">
      <div>
        <div class="popular-bundle-list-top2">
          <a :href="$getProUrl($store.state.locale, 828)">
            <h3 class="proname">
              <span v-html="$getProName(828, $store.state.locale, true)"></span>
              <span
                class="pricecolor"
                v-html="
                  $translatePrice(
                    $store.state.locale,
                    $store.state.currency[$store.state.locale][1],
                    `<p style='display: inline;'>${
                      _getBundlesPrice(828) - $getProPrice(828, $store.state.currency[$store.state.locale][0])
                    }</p>`,
                  )
                "
              >
              </span>
              <p class="pricecolor" style="display: inline" v-html="$t('cinavia.off')"></p>
            </h3>
          </a>
        </div>
        <div class="popular-bundle-list-bottom">
          <div class="blundleblockiconleft">
            <my-img width="510" height="510" layout="responsive" :src="cinavias" :lazy="true" />
          </div>
          <div class="blundleblockiconright">
            <p class="bundleinclude" v-html="$t('cinavia.bundle_includes')"></p>
            <ul class="bundlepro">
              <li>
                <a
                  :href="$getProUrl($store.state.locale, 826)"
                  v-html="$getProName(826, $store.state.locale, true)"
                ></a>
              </li>
              <li>
                <a
                  :href="$getProUrl($store.state.locale, 827)"
                  v-html="$getProName(827, $store.state.locale, true)"
                ></a>
              </li>
            </ul>
            <p class="price">
              <span
                class="oriprice"
                v-html="
                  $translatePrice(
                    $store.state.locale,
                    $store.state.currency[$store.state.locale][1],
                    `${_getBundlesPrice(828)}`,
                  )
                "
              >
              </span>
              <span
                class="nowprice"
                v-html="
                  $translatePrice(
                    $store.state.locale,
                    $store.state.currency[$store.state.locale][1],
                    `${$getProPrice(828, $store.state.currency[$store.state.locale][0])}`,
                  )
                "
              >
              </span>
              <label v-if="$store.state.hasVAT" style="color: #555; font-size: 14px">
                ({{ $t('common_basic.VAT') }})</label
              >
            </p>
            <div class="popular-buy" style="display: inline-block">
              <a
                :href="$getCheckoutUrl(828, 'LFT')"
                class="buy-btn quicksand-bold"
              >
                <i class="buy_banner"></i>
                <i class="buy_banner_h"></i>
                <span v-html="$t('common_basic.buynow')"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </li>
    <li class="popular-bundle-list">
      <div>
        <div class="popular-bundle-list-top2">
          <h3 class="proname">
            <span v-html="$t('cinavia.pro_block_2_name')"></span>
            <!-- <span
                      class="pricecolor"
                      v-html="
                        $translatePrice(
                          $store.state.locale,
                          $store.state.currency[$store.state.locale][1],
                          `${
                            _getBundlesPrice(729) -
                            $getProPrice(729, $store.state.currency[$store.state.locale][0])
                          }`
                        )
                      "
                    ></span>
                    <span class="pricecolor">{{ $t('cinavia.off') }}</span> -->
          </h3>
        </div>
        <div class="popular-bundle-list-bottom">
          <div class="blundleblockiconleft">
            <my-img width="510" height="510" layout="responsive" :src="cinaviass" :lazy="true" />
          </div>
          <div class="blundleblockiconright">
            <p class="bundleinclude" v-html="$t('cinavia.bundle_includes')"></p>
            <ul class="bundlepro">
              <li>
                <a
                  :href="$getProUrl($store.state.locale, 827)"
                  v-html="$getProName(827, $store.state.locale, true)"
                ></a>
              </li>
              <li>
                <a
                  :href="$getProUrl($store.state.locale, 844)"
                  v-html="$getProName(844, $store.state.locale, true)"
                ></a>
              </li>
            </ul>
            <p class="price">
              <!-- <span
                        class="oriprice"
                        v-html="
                          $translatePrice(
                            $store.state.locale,
                            $store.state.currency[$store.state.locale][1],
                            `${_getBundlesPrice(729)}`
                          )
                        "
                      >
                      </span> -->
              <span
                class="nowprice"
                v-html="
                  $translatePrice(
                    $store.state.locale,
                    $store.state.currency[$store.state.locale][1],
                    `${$getProPrice(729, $store.state.currency[$store.state.locale][0])}`,
                  )
                "
              >
              </span>
              <label v-if="$store.state.hasVAT" style="color: #555; font-size: 14px">
                ({{ $t('common_basic.VAT') }})
              </label>
            </p>
            <div class="popular-buy" style="display: inline-block">
              <a
                :href="$getCheckoutUrl(729, 'LFT', 'dlang=ene')"
                class="buy-btn quicksand-bold"
              >
                <i class="buy_banner"></i>
                <i class="buy_banner_h"></i>
                {{ $t('common_basic.buynow') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
