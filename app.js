(() => {
  /* 34–46，含半码；规格多时用横向滚动承载 */
  const SIZES = Array.from({ length: (46 - 34) * 2 + 1 }, (_, i) => 34 + i * 0.5);
  const FILTER_SIZES = SIZES.slice();

  const GRADES = {
    SS: {
      label: "全新未使用",
      short: "鞋盒吊牌完好，无任何穿着痕迹",
      tab: "未使用",
      flawBrief: "极轻微瑕疵",
      off: 0.12,
      summary: [
        { k: "外观", v: "接近新品" },
        { k: "功能", v: "完好" },
        { k: "配件", v: "齐全" },
      ],
      flaws: ["无明显瑕疵", "鞋盒完好"],
    },
    S: {
      label: "极少穿着 / 仅试穿",
      short: "无可见穿着痕迹，功能完好，可能吊牌已摘",
      tab: "极少穿着",
      flawBrief: "轻微瑕疵",
      off: 0.18,
      summary: [
        { k: "外观", v: "未见明显穿着" },
        { k: "功能", v: "完好" },
        { k: "配件", v: "基本齐全" },
      ],
      flaws: ["可能吊牌已摘", "鞋盒轻微压痕"],
    },
    A: {
      label: "轻微使用",
      short: "有轻微穿着痕迹，不影响整体外观和功能",
      tab: "轻微使用",
      flawBrief: "轻微瑕疵",
      off: 0.28,
      summary: [
        { k: "外观", v: "轻微穿着痕迹" },
        { k: "功能", v: "完好" },
        { k: "配件", v: "基本齐全" },
      ],
      flaws: ["鞋面轻微褶皱", "中底轻度氧化"],
    },
    B: {
      label: "日常使用",
      short: "有明显穿着痕迹，功能基本完好",
      tab: "日常使用",
      flawBrief: "可见瑕疵",
      off: 0.4,
      summary: [
        { k: "外观", v: "明显穿着痕迹" },
        { k: "功能", v: "基本完好" },
        { k: "配件", v: "可能缺失" },
      ],
      flaws: ["鞋面褶皱较明显", "大底有磨损", "局部污渍已清洁"],
    },
  };

  const AUTH_SHOTS = [
    { pos: "40% 45%", label: "L" },
    { pos: "70% 40%", label: "R" },
    { pos: "30% 60%", label: "" },
    { pos: "55% 35%", label: "" },
    { pos: "25% 70%", label: "" },
    { pos: "60% 50%", label: "" },
    { pos: "48% 30%", label: "" },
    { pos: "35% 55%", label: "" },
  ];

  function authGridHTML(posBias) {
    return AUTH_SHOTS.map((s, i) => {
      const pos = i === 0 && posBias ? posBias : s.pos;
      const label = s.label ? ` data-label="${s.label}"` : "";
      return `<span class="auth-shot"${label} style="background-position:${pos}"></span>`;
    }).join("");
  }

  function fillAuthCard(ids, gradeKey, code, posBias) {
    const g = GRADES[gradeKey];
    const detailN = Math.max(1, g.flaws.length);
    const letter = $(ids.letter);
    const name = $(ids.name);
    const detail = $(ids.detail);
    const reportId = $(ids.reportId);
    const grid = $(ids.grid);
    if (letter) letter.textContent = gradeKey;
    if (name) name.textContent = g.tab;
    if (detail) detail.textContent = `${detailN}处细节 ›`;
    if (reportId) reportId.textContent = `报告编号: 95${code}${gradeKey.charCodeAt(0)}${detailN}48649`;
    if (grid) grid.innerHTML = authGridHTML(posBias);

    const byKey = Object.fromEntries(g.summary.map((row) => [row.k, row.v]));
    const root = $(ids.root);
    if (root) {
      const look = root.querySelector('[data-defect="look"]');
      const func = root.querySelector('[data-defect="func"]');
      const parts = root.querySelector('[data-defect="parts"]');
      if (look) look.textContent = byKey["外观"] || g.short;
      if (func) func.textContent = byKey["功能"] || "完好";
      if (parts) parts.textContent = byKey["配件"] || "基本齐全";
    }
  }

  const AUTH_IDS = {
    rec: {
      root: "#recAuthCard",
      letter: "#recGradeLetter",
      name: "#recGradeName",
      detail: "#recDetailLink",
      reportId: "#recReportId",
      grid: "#recAuthGrid",
    },
    co: {
      root: "#coAuthCard",
      letter: "#coGradeLetter",
      name: "#coGradeName",
      detail: "#coDetailLink",
      reportId: "#coReportId",
      grid: "#coAuthGrid",
    },
    report: {
      root: "#reportAuthCard",
      letter: "#reportGradeLetter",
      name: "#reportGradeName",
      detail: "#reportDetailLink",
      reportId: "#reportId",
      grid: "#reportAuthGrid",
    },
  };

  const NEW_BASE = Object.fromEntries(
    SIZES.map((sz) => {
      const mid = 43;
      const delta = Math.abs(sz - mid);
      return [sz, Math.round(515 + delta * 4 + (sz % 1 ? 2 : 0))];
    })
  );

  /* 方案2/3：在售单件（覆盖多尺码，演示规格较多） */
  const GOODS = [
    { id: "g01", size: 36, grade: "A", delivery: "约1-3天到", pos: "40% 45%", code: "4401" },
    { id: "g02", size: 37, grade: "S", delivery: "约2天到", pos: "55% 35%", code: "4404" },
    { id: "g03", size: 38, grade: "A", delivery: "约1-3天到", pos: "30% 60%", code: "4408" },
    { id: "g04", size: 39, grade: "B", delivery: "约1-3天到", pos: "70% 40%", code: "4410" },
    { id: "g05", size: 40, grade: "SS", delivery: "约2天到", pos: "25% 70%", code: "4412" },
    { id: "g06", size: 40.5, grade: "A", delivery: "约1-3天到", pos: "60% 50%", code: "4415" },
    { id: "g07", size: 41, grade: "S", delivery: "约1-3天到", pos: "48% 30%", code: "4418" },
    { id: "g08", size: 42, grade: "A", delivery: "约1-3天到", pos: "35% 55%", code: "4421" },
    { id: "g09", size: 42.5, grade: "B", delivery: "约1-3天到", pos: "45% 40%", code: "4424" },
    { id: "g10", size: 43, grade: "SS", delivery: "约2天到", pos: "50% 45%", code: "4427" },
    { id: "g11", size: 43, grade: "A", delivery: "约1-3天到", pos: "32% 58%", code: "4429" },
    { id: "g12", size: 44, grade: "A", delivery: "约1-3天到", pos: "58% 42%", code: "4432" },
    { id: "g13", size: 44, grade: "S", delivery: "约2天到", pos: "28% 65%", code: "4435" },
    { id: "g14", size: 44.5, grade: "A", delivery: "约1-3天到", pos: "62% 38%", code: "4438" },
    { id: "g15", size: 45, grade: "A", delivery: "约2天到", pos: "40% 50%", code: "4441" },
    { id: "g16", size: 46, grade: "B", delivery: "约1-3天到", pos: "52% 48%", code: "4444" },
  ].map((g) => ({
    ...g,
    price: Math.round(NEW_BASE[g.size] * (1 - GRADES[g.grade].off)),
  }));

  /* 成色权重：A 轻微使用性价比最高，作为「最合适」优先 */
  const GRADE_WEIGHT = { A: 4, S: 3, SS: 3, B: 1 };

  const state = {
    mode: "proposal3",
    tab: "used",
    grade: "A",
    size: 44,
    channel: "fast",
    filterAll: true,
    filterSizes: new Set(),
    goodsId: GOODS[0].id,
    recIndex: 0,
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const phone = $("#phone");
  const sheet = $("#sheet");
  const sizeGrid = $("#sizeGrid");
  const sizeChips = $("#sizeChips");
  const recommendChips = $("#recommendChips");
  const goodsList = $("#goodsList");
  const usedPanel = $("#usedPanel");
  const goodsPanel = $("#goodsPanel");
  const recommendPanel = $("#recommendPanel");
  const seriesBlock = $("#seriesBlock");
  const seriesChips = $("#seriesChips");
  const skuBlock = $("#skuBlock");
  const channelBar = $("#channelBar");
  const gradeChannelBar = $("#gradeChannelBar");
  const ctaBar = $("#ctaBar");
  const checkout = $("#checkout");
  const report = $("#report");
  const gradeSheet = $("#gradeSheet");
  const goodsSheet = $("#goodsSheet");
  const goodsSheetList = $("#goodsSheetList");

  function newPrice(size) {
    return NEW_BASE[size] ?? 515;
  }

  function brandPrice(size) {
    return Math.round(newPrice(size) + 25);
  }

  function usedPrice(size, grade = state.grade) {
    return Math.round(newPrice(size) * (1 - GRADES[grade].off));
  }

  function channel95Price(size) {
    return usedPrice(size, "A");
  }

  function selectedGoods() {
    return GOODS.find((g) => g.id === state.goodsId) || null;
  }

  function filteredGoods() {
    if (state.filterAll || state.filterSizes.size === 0) return GOODS.slice();
    return GOODS.filter((g) => state.filterSizes.has(g.size));
  }

  function candidatesForSize(size) {
    return GOODS.filter((g) => g.size === size);
  }

  /** 方案3 当前尺码下的候选件 */
  function recommendPool() {
    return candidatesForSize(state.size);
  }

  /** 排序：成色合适优先，其次低价 */
  function rankCandidates(list) {
    return list.slice().sort((a, b) => {
      const dw = (GRADE_WEIGHT[b.grade] || 0) - (GRADE_WEIGHT[a.grade] || 0);
      if (dw) return dw;
      return a.price - b.price;
    });
  }

  function recommendReason(g, ranked) {
    if (!g) return "";
    const cheapest = ranked.slice().sort((a, b) => a.price - b.price)[0];
    if (g.grade === "A") return "同尺码优选 · 轻微使用性价比";
    if (cheapest && g.id === cheapest.id) return "同尺码低价";
    if (g.grade === "SS" || g.grade === "S") return "同尺码高成色";
    return "同尺码匹配";
  }

  function isProposalMode() {
    return (
      state.mode === "proposal" ||
      state.mode === "proposal2" ||
      state.mode === "proposal3" ||
      state.mode === "proposal4"
    );
  }

  /** 方案4：成色即渠道 */
  function isGradeChannelFlow() {
    return state.mode === "proposal4" && state.tab === "used";
  }

  function isUsedContext() {
    if (isProposalMode()) return state.tab === "used";
    return state.channel === "95" || state.tab === "used";
  }

  /** 方案2：列表自选单件 */
  function isListFlow() {
    return state.mode === "proposal2" && state.tab === "used";
  }

  /** 方案3：系统推荐一件，不浏览列表 */
  function isRecommendFlow() {
    return state.mode === "proposal3" && state.tab === "used";
  }

  /** 下单绑定具体 goods */
  function isGoodsBound() {
    return isListFlow() || isRecommendFlow();
  }

  function currentPrice() {
    if (isGoodsBound()) {
      const g = selectedGoods();
      return g ? g.price : 0;
    }
    if (isProposalMode() && state.tab === "used") {
      return usedPrice(state.size);
    }
    if (state.channel === "95") return channel95Price(state.size);
    if (state.channel === "brand") return brandPrice(state.size);
    return newPrice(state.size);
  }

  /** 底部：现状三渠道 / 方案新品双渠道 / 方案4成色渠道 / 其余闲置 CTA */
  function syncFooter() {
    const showNewChannels =
      state.mode === "current" || (isProposalMode() && state.tab === "new");
    const showGradeChannels = isGradeChannelFlow();
    const showCta = isProposalMode() && state.tab === "used" && !showGradeChannels;

    channelBar.hidden = !showNewChannels;
    gradeChannelBar.hidden = !showGradeChannels;
    ctaBar.hidden = !showCta;

    if (showNewChannels) {
      channelBar.dataset.variant = state.mode === "current" ? "full" : "new";
      if (isProposalMode() && state.channel === "95") {
        state.channel = "fast";
      }
    }

    $("#chFastPrice").textContent = `¥${newPrice(state.size)}`;
    $("#chBrandPrice").textContent = `¥${brandPrice(state.size)}`;
    $("#ch95Price").textContent = `¥${channel95Price(state.size)}`;

    $$("#channelBar .channel").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.channel === state.channel);
    });

    if (showGradeChannels) {
      ["SS", "S", "A", "B"].forEach((letter) => {
        const el = document.querySelector(`[data-grade-price="${letter}"]`);
        if (el) el.textContent = `¥${usedPrice(state.size, letter)}`;
      });
      $$("#gradeChannelBar .channel").forEach((btn) => {
        btn.classList.toggle("on", btn.dataset.grade === state.grade);
      });
    }
  }

  function ensureListSelection() {
    const list = filteredGoods().sort((a, b) => a.price - b.price);
    if (!list.length) {
      state.goodsId = null;
      return;
    }
    if (!list.some((g) => g.id === state.goodsId)) {
      state.goodsId = list[0].id;
    }
  }

  /** 方案3：按筛选自动推荐最合适一件 */
  function ensureRecommend() {
    const ranked = rankCandidates(recommendPool());
    if (!ranked.length) {
      state.goodsId = null;
      state.recIndex = 0;
      return ranked;
    }
    if (state.recIndex >= ranked.length) state.recIndex = 0;
    state.goodsId = ranked[state.recIndex].id;
    state.size = ranked[state.recIndex].size;
    return ranked;
  }

  function priceForSize(sz) {
    if (state.mode === "current" && state.channel === "95") return channel95Price(sz);
    if (state.mode === "current" && state.channel === "brand") return brandPrice(sz);
    if ((state.mode === "proposal" || state.mode === "proposal4") && state.tab === "used") {
      return usedPrice(sz, state.grade);
    }
    if (isProposalMode() && state.tab === "new" && state.channel === "brand") {
      return brandPrice(sz);
    }
    return newPrice(sz);
  }

  /** 就地更新尺码格，避免 innerHTML 重绘闪动 */
  function renderSizes({ force = false } = {}) {
    const used = isUsedContext() && !isGoodsBound();
    const needsRebuild =
      force ||
      sizeGrid.children.length !== SIZES.length ||
      !sizeGrid.querySelector(".size-cell-inner");

    if (needsRebuild) {
      sizeGrid.innerHTML = SIZES.map(
        (sz) => `
        <button type="button" class="size-cell" data-size="${sz}" role="option" aria-selected="false">
          <span class="size-cell-inner">
            <strong class="heiti size-num">${sz}</strong>
            <span class="size-price"></span>
          </span>
        </button>`
      ).join("");
    }

    SIZES.forEach((sz, i) => {
      const cell = sizeGrid.children[i];
      if (!cell) return;
      const sold = used && (sz <= 34.5 || sz >= 45.5);
      const on = sz === state.size && !sold;
      const priceText = sold ? "¥--" : `¥${priceForSize(sz)}`;
      cell.classList.toggle("on", on);
      cell.classList.toggle("sold", sold);
      cell.setAttribute("aria-selected", String(on));
      const priceEl = cell.querySelector(".size-price");
      if (priceEl && priceEl.textContent !== priceText) {
        priceEl.textContent = priceText;
      }
    });
  }

  function renderChips() {
    const chips = [
      `<button type="button" class="size-chip${state.filterAll ? " on" : ""}" data-chip="all">全部</button>`,
      ...FILTER_SIZES.map((sz) => {
        const on = !state.filterAll && state.filterSizes.has(sz);
        const count = GOODS.filter((g) => g.size === sz).length;
        const disabled = count === 0;
        return `<button type="button" class="size-chip${on ? " on" : ""}" data-chip="${sz}" ${disabled ? "disabled" : ""}>${sz}</button>`;
      }),
    ];
    sizeChips.innerHTML = chips.join("");
  }

  function renderGoodsList() {
    ensureListSelection();
    const list = filteredGoods().sort((a, b) => a.price - b.price);
    $("#goodsCountTip").textContent = `在售 ${list.length} 件`;

    if (!list.length) {
      goodsList.innerHTML = `<div class="goods-empty">该尺码暂无在售闲置</div>`;
      return;
    }

    goodsList.innerHTML = list
      .map((g) => {
        const meta = GRADES[g.grade];
        const on = g.id === state.goodsId;
        return `
          <button type="button" class="goods-card${on ? " on" : ""}" data-id="${g.id}" role="option" aria-selected="${on}">
            <span class="goods-photo" style="background-position:${g.pos}" aria-hidden="true"></span>
            <span class="goods-body">
              <span class="goods-grade heiti">${g.grade} · ${meta.tab}</span>
              <span class="goods-desc">${meta.short}</span>
              <span class="goods-meta">${g.size}码 · ${g.delivery}</span>
            </span>
            <span class="goods-side">
              <span class="goods-price heiti">¥${g.price}</span>
              <span class="goods-arrow">鉴别报告 ›</span>
            </span>
          </button>
        `;
      })
      .join("");
  }

  function renderRecommendChips() {
    const withStock = FILTER_SIZES.filter((sz) => candidatesForSize(sz).length);
    if (withStock.length && !withStock.includes(state.size)) {
      state.size = withStock.includes(43) ? 43 : withStock[0];
    }
    recommendChips.innerHTML = FILTER_SIZES.map((sz) => {
      const stock = candidatesForSize(sz).length;
      const on = sz === state.size;
      return `<button type="button" class="size-chip${on ? " on" : ""}${stock ? "" : " sold"}" data-chip="${sz}" ${stock ? "" : "disabled"}>${sz}</button>`;
    }).join("");
  }

  function renderRecommend() {
    const ranked = ensureRecommend();
    const g = selectedGoods();
    const card = $("#recommendCard");
    const empty = $("#recEmpty");
    const poolBtn = $("#poolListBtn");

    if (!g) {
      card.hidden = true;
      empty.hidden = false;
      if (poolBtn) {
        poolBtn.hidden = true;
        poolBtn.textContent = "共 0 件可选 ›";
      }
      return;
    }

    card.hidden = false;
    empty.hidden = true;
    if (poolBtn) {
      poolBtn.hidden = false;
      poolBtn.textContent = `共 ${ranked.length} 件可选 ›`;
    }
    $("#recReason").textContent = recommendReason(g, ranked);
    fillAuthCard(AUTH_IDS.rec, g.grade, g.code, g.pos);
  }

  function renderGoodsSheetList() {
    const ranked = rankCandidates(recommendPool());
    if (!ranked.length) {
      goodsSheetList.innerHTML = `<div class="goods-empty">暂无在售闲置</div>`;
      return;
    }
    goodsSheetList.innerHTML = ranked
      .map((g) => {
        const meta = GRADES[g.grade];
        const on = g.id === state.goodsId;
        return `
          <button type="button" class="goods-card${on ? " on" : ""}" data-id="${g.id}" role="option" aria-selected="${on}">
            <span class="goods-photo" style="background-position:${g.pos}" aria-hidden="true"></span>
            <span class="goods-body">
              <span class="goods-grade heiti">${g.grade} · ${meta.tab}</span>
              <span class="goods-desc">${meta.short}</span>
              <span class="goods-meta">${g.size}码 · ${g.delivery}</span>
            </span>
            <span class="goods-side">
              <span class="goods-price heiti">¥${g.price}</span>
              <span class="goods-arrow">选择 ›</span>
            </span>
          </button>
        `;
      })
      .join("");
  }

  function openGoodsSheet() {
    renderGoodsSheetList();
    if (typeof goodsSheet.showModal === "function") goodsSheet.showModal();
    else goodsSheet.setAttribute("open", "");
  }

  function closeGoodsSheet() {
    if (typeof goodsSheet.close === "function") goodsSheet.close();
    else goodsSheet.removeAttribute("open");
  }

  function renderExpect() {
    if (!$("#gradePill")) return;
    const g = GRADES[state.grade];
    $("#gradePill").textContent = `${state.grade} · ${g.label}`;
    $("#expectHint").textContent = g.short;
  }

  function renderHeader() {
    const price = currentPrice();
    const used = isUsedContext();
    $("#headerPrice").textContent = String(price || "--");
    $("#ctaPrice").textContent = String(price || "--");

    const save = $("#saveTag");
    const aside = $("#priceAside");
    const dealSave = $("#dealSave");
    const refSize = isGoodsBound() && selectedGoods() ? selectedGoods().size : state.size;
    const launchGap = Math.max(0, 690 - (price || 0));
    const subsidy = used ? Math.max(10, Math.round((newPrice(refSize) - (price || 0)) * 0.15)) : 25;

    if (aside) {
      aside.hidden = false;
      aside.textContent = used
        ? `仅剩1件 比新品低¥${Math.max(0, newPrice(refSize) - (price || 0))}`
        : `仅剩2件 比发售价低¥${launchGap}`;
    }
    if (dealSave) dealSave.textContent = `限时补贴已省¥${subsidy}`;

    if (used && price) {
      const diff = newPrice(refSize) - price;
      save.hidden = true;
      save.textContent = `比新品省 ¥${diff}`;
      if (isRecommendFlow()) {
        const g = selectedGoods();
        $("#ctaLabel").textContent = g
          ? `${g.delivery} · ${g.grade} · ${GRADES[g.grade].tab}`
          : "该尺码暂无闲置";
      } else if (isListFlow()) {
        const g = selectedGoods();
        $("#ctaLabel").textContent = g
          ? `${g.delivery} · ${g.grade} · ${GRADES[g.grade].tab}`
          : "请选择在售闲置";
      } else if (state.mode === "proposal" || state.mode === "proposal4") {
        $("#ctaLabel").textContent = `约1-3天到 · ${state.grade} · ${GRADES[state.grade].tab}`;
      } else {
        $("#ctaLabel").textContent = "约1-3天到 · 轻微使用";
      }
    } else {
      save.hidden = true;
      if (state.channel === "brand") {
        $("#ctaLabel").textContent = "品牌官方";
      } else {
        $("#ctaLabel").textContent = "新品 · 次日达";
      }
    }

    $("#buyBtn").disabled = isGoodsBound() && !selectedGoods();
  }

  function renderGradeSheet(activeGrade) {
    const key = activeGrade || (isGoodsBound() ? selectedGoods()?.grade : state.grade) || "A";
    $("#gradeExamples").innerHTML = Object.entries(GRADES)
      .map(([letter, g]) => {
        const active = letter === key ? " active" : "";
        const note = letter === key ? " · 本单" : "";
        return `<li class="${active.trim()}">
          <div class="ge-swatch ${letter.toLowerCase()}" aria-hidden="true"></div>
          <div class="ge-body">
            <div class="ge-title"><span class="ge-letter">${letter}</span><strong class="heiti">${g.label}</strong></div>
            <p>${g.short}${note}</p>
          </div>
        </li>`;
      })
      .join("");
  }

  function renderReport() {
    const goods = isGoodsBound() ? selectedGoods() : null;
    const gradeKey = goods ? goods.grade : state.grade;
    const g = GRADES[gradeKey];
    const price = goods ? goods.price : currentPrice();
    const size = goods ? goods.size : state.size;
    const code = goods ? goods.code : "4412";
    const delivery = goods ? goods.delivery : "约1-3天到";

    $("#reportPrice").textContent = String(price);
    $("#reportGoodsMeta").textContent = `已选：${size}码 · ${gradeKey} · ${g.tab}`;
    $("#reportDesc").textContent = `平台已验 预计${delivery.replace(/^约/, "")}送达`;
    $("#reportCtaLabel").textContent = `确认收货后付款 ¥${price}`;
    fillAuthCard(AUTH_IDS.report, gradeKey, code, goods ? goods.pos : "40% 45%");
  }

  function syncUI() {
    phone.dataset.mode = state.mode;
    sheet.dataset.mode = state.mode;
    sheet.dataset.tab = state.tab;

    $$(".scheme-switch button").forEach((btn) => {
      const on = btn.dataset.mode === state.mode;
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-selected", String(on));
    });

    $$(".primary-tab").forEach((btn) => {
      const on = btn.dataset.tab === state.tab;
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-selected", String(on));
    });

    $$(".legacy-tab").forEach((btn) => {
      const on = (btn.dataset.legacy === "used") === (state.tab === "used");
      btn.classList.toggle("on", on);
    });

    $$(".grade-tab").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.grade === state.grade);
    });

    usedPanel.hidden = !(state.mode === "proposal" && state.tab === "used");
    goodsPanel.hidden = !isListFlow();
    recommendPanel.hidden = !isRecommendFlow();
    if (seriesBlock) seriesBlock.hidden = state.mode !== "proposal4";
    skuBlock.hidden = isListFlow() || isRecommendFlow();

    if (isProposalMode() && state.tab === "new" && state.channel === "95") {
      state.channel = "fast";
    }
    if (isProposalMode() && state.tab === "used") {
      state.channel = "95";
    }

    if (seriesChips) {
      $$(".series-chip", seriesChips).forEach((btn) => {
        const on = btn.dataset.tab === state.tab;
        btn.classList.toggle("on", on);
        btn.setAttribute("aria-selected", String(on));
      });
    }

    if (isListFlow()) {
      renderChips();
      renderGoodsList();
    } else if (isRecommendFlow()) {
      if (!candidatesForSize(state.size).length) {
        const fallback = FILTER_SIZES.find((sz) => candidatesForSize(sz).length);
        if (fallback) state.size = fallback;
      }
      renderRecommendChips();
      renderRecommend();
    } else {
      renderExpect();
      renderSizes();
    }
    syncFooter();
    renderHeader();
  }

  function openCheckout() {
    if (isGoodsBound() && !selectedGoods()) return;

    const used = isUsedContext() || state.channel === "95";
    const goods = isGoodsBound() ? selectedGoods() : null;
    const gradeKey = goods ? goods.grade : used ? state.grade || "A" : state.grade;
    const g = GRADES[gradeKey] || GRADES.A;
    const price = currentPrice();
    const size = goods ? goods.size : state.size;
    const delivery = goods ? goods.delivery : used ? "约1-3天到" : "次日达";
    const code = goods ? goods.code : "4412";

    report.hidden = true;
    checkout.hidden = false;
    checkout.dataset.kind = used ? "used" : "new";

    $("#coPrice").textContent = String(price);
    $("#paySub").textContent = `确认收货后付款 ¥${price}`;
    $("#coAuthCard").hidden = !used;
    $("#coNewServices").hidden = used;
    const usedSvc = $("#coUsedServices");
    if (usedSvc) usedSvc.hidden = !used;

    if (used) {
      $("#coPriceTip").textContent = "同成色低价 价格明细 ›";
      $("#coSelected").textContent = goods
        ? `已选：${size}码 · ${gradeKey} · ${g.tab}`
        : `已选：${size}码 · ${gradeKey} · ${g.tab}`;
      $("#coEta").textContent = `平台已验 预计${delivery.replace(/^约/, "")}送达`;
      fillAuthCard(AUTH_IDS.co, gradeKey, code, goods ? goods.pos : "40% 45%");
    } else {
      const channelName = state.channel === "brand" ? "品牌官方" : "次日达";
      $("#coPriceTip").textContent = "正品现货 价格明细 ›";
      $("#coSelected").textContent = `已选：${size}码 · 新品 · ${channelName}`;
      $("#coEta").textContent =
        state.channel === "brand" ? "品牌直发 预计2-5天送达" : "平台已验 预计次日送达";
    }
  }

  function closeCheckout() {
    checkout.hidden = true;
  }

  function openReport() {
    if (isGoodsBound() && !selectedGoods()) return;
    renderReport();
    report.hidden = false;
  }

  function closeReport() {
    report.hidden = true;
  }

  function openGradeSheet() {
    renderGradeSheet();
    if (typeof gradeSheet.showModal === "function") gradeSheet.showModal();
    else gradeSheet.setAttribute("open", "");
  }

  $$(".scheme-switch button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mode = btn.dataset.mode;
      if (state.mode === "current") {
        state.channel = state.tab === "used" ? "95" : "fast";
      }
      closeCheckout();
      closeReport();
      syncUI();
    });
  });

  function applyTab(tab) {
    state.tab = tab;
    state.channel = tab === "used" ? "95" : "fast";
    if (tab === "used" && state.mode === "proposal2") {
      state.filterAll = true;
      state.filterSizes.clear();
    }
    if (tab === "used" && state.mode === "proposal3") {
      state.recIndex = 0;
    }
    syncUI();
  }

  $$(".primary-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTab(btn.dataset.tab);
    });
  });

  if (seriesChips) {
    seriesChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".series-chip");
      if (!chip) return;
      applyTab(chip.dataset.tab);
    });
  }

  $$(".legacy-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tab = btn.dataset.legacy === "used" ? "used" : "new";
      state.channel = state.tab === "used" ? "95" : "fast";
      syncUI();
    });
  });

  $$(".grade-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.grade = btn.dataset.grade;
      syncUI();
    });
  });

  sizeGrid.addEventListener("click", (e) => {
    const cell = e.target.closest(".size-cell");
    if (!cell || cell.classList.contains("sold")) return;
    const next = Number(cell.dataset.size);
    if (next === state.size) return;
    state.size = next;
    /* 只更新选中态与价格区，不整页重绘 */
    renderSizes();
    syncFooter();
    renderHeader();
  });

  sizeChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".size-chip");
    if (!chip || chip.disabled) return;
    const key = chip.dataset.chip;
    if (key === "all") {
      state.filterAll = true;
      state.filterSizes.clear();
    } else {
      const sz = Number(key);
      if (state.filterAll) {
        state.filterAll = false;
        state.filterSizes = new Set([sz]);
      } else if (state.filterSizes.has(sz)) {
        state.filterSizes.delete(sz);
        if (state.filterSizes.size === 0) state.filterAll = true;
      } else {
        state.filterSizes.add(sz);
      }
    }
    syncUI();
  });

  goodsList.addEventListener("click", (e) => {
    const card = e.target.closest(".goods-card");
    if (!card) return;
    state.goodsId = card.dataset.id;
    syncUI();
    openReport();
  });

  recommendChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".size-chip");
    if (!chip) return;
    state.size = Number(chip.dataset.chip);
    state.recIndex = 0;
    syncUI();
  });

  $("#poolListBtn").addEventListener("click", () => {
    openGoodsSheet();
  });

  $("#recGradeInfoBtn").addEventListener("click", () => {
    openGradeSheet();
  });

  $("#coGradeInfoBtn").addEventListener("click", () => {
    openGradeSheet();
  });

  goodsSheetList.addEventListener("click", (e) => {
    const card = e.target.closest(".goods-card");
    if (!card) return;
    const id = card.dataset.id;
    const ranked = rankCandidates(recommendPool());
    const idx = ranked.findIndex((g) => g.id === id);
    if (idx < 0) return;
    state.recIndex = idx;
    state.goodsId = id;
    state.size = ranked[idx].size;
    closeGoodsSheet();
    syncUI();
  });

  $("#goodsSheetClose").addEventListener("click", closeGoodsSheet);

  goodsSheet.addEventListener("click", (e) => {
    if (e.target === goodsSheet) closeGoodsSheet();
  });

  $$("#channelBar .channel").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ch = btn.dataset.channel;
      state.channel = ch;
      if (state.mode === "current") {
        state.tab = ch === "95" ? "used" : "new";
        syncUI();
        openCheckout();
        return;
      }
      /* 方案新品：渠道拆分，点渠道进确认订单 */
      if (isProposalMode() && state.tab === "new") {
        state.tab = "new";
        syncUI();
        openCheckout();
      }
    });
  });

  $$("#gradeChannelBar .channel").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.grade = btn.dataset.grade;
      state.channel = "95";
      state.tab = "used";
      syncUI();
      openCheckout();
    });
  });

  $("#gradeHelpBtn").addEventListener("click", openGradeSheet);
  $("#reportEntry").addEventListener("click", openReport);
  $("#reportBack").addEventListener("click", closeReport);
  $("#reportGradeOpen").addEventListener("click", openGradeSheet);
  $("#reportBuyBtn").addEventListener("click", openCheckout);
  $("#buyBtn").addEventListener("click", openCheckout);
  $("#backBtn").addEventListener("click", closeCheckout);

  $("#payBtn").addEventListener("click", () => {
    $("#payBtn").textContent = "已下单";
    setTimeout(() => {
      closeCheckout();
      closeReport();
      $("#payBtn").textContent = "立即购买";
    }, 800);
  });

  gradeSheet.addEventListener("click", (e) => {
    if (e.target === gradeSheet) gradeSheet.close();
  });

  const qtyNum = $("#qtyNum");
  $$(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!qtyNum) return;
      const next = Math.max(1, Math.min(9, Number(qtyNum.textContent || 1) + Number(btn.dataset.qty)));
      qtyNum.textContent = String(next);
    });
  });

  syncUI();
})();
