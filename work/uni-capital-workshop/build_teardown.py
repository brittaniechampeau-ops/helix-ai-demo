from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.section import WD_SECTION

OUT = "outputs/uni-capital-workshop/UNI-ETI-acquirer-thesis-teardown.docx"

NAVY = "13253F"
CYAN = "00A9CE"
MID = "50616F"
PALE = "EAF3F6"
GRID = "D9D9D9"

def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = tcPr.find(qn('w:shd'))
    if shd is None:
        shd = OxmlElement('w:shd')
        tcPr.append(shd)
    shd.set(qn('w:fill'), fill)

def borders(cell, color=GRID):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in('w:tcBorders')
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    for edge in ('top','left','bottom','right','insideH','insideV'):
        tag = 'w:' + edge
        el = tcBorders.find(qn(tag))
        if el is None:
            el = OxmlElement(tag)
            tcBorders.append(el)
        el.set(qn('w:val'), 'single')
        el.set(qn('w:sz'), '6')
        el.set(qn('w:color'), color)

def set_cell_margins(cell, top=100, start=110, bottom=100, end=110):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = tcPr.first_child_found_in('w:tcMar')
    if tcMar is None:
        tcMar = OxmlElement('w:tcMar')
        tcPr.append(tcMar)
    for m, v in [('top',top),('start',start),('bottom',bottom),('end',end)]:
        node = tcMar.find(qn('w:' + m))
        if node is None:
            node = OxmlElement('w:' + m)
            tcMar.append(node)
        node.set(qn('w:w'), str(v))
        node.set(qn('w:type'), 'dxa')

def set_cell_text(cell, text, bold=False, color='000000', size=9.2):
    cell.text = ''
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.05
    r = p.add_run(text)
    r.font.name = 'Aptos'
    r._element.rPr.rFonts.set(qn('w:eastAsia'), 'Aptos')
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.color.rgb = RGBColor.from_string(color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    set_cell_margins(cell)
    borders(cell)

def add_title(doc, text):
    p = doc.add_paragraph(style='Title')
    p.paragraph_format.space_after = Pt(5)
    r = p.add_run(text)
    r.font.name = 'Aptos Display'
    r._element.rPr.rFonts.set(qn('w:eastAsia'), 'Aptos Display')
    r.font.size = Pt(27)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0,0,0)

def add_heading(doc, text, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14 if level == 1 else 8)
    p.paragraph_format.space_after = Pt(5)
    r = p.add_run(text)
    r.font.name = 'Aptos Display'
    r._element.rPr.rFonts.set(qn('w:eastAsia'), 'Aptos Display')
    r.font.bold = True
    r.font.size = Pt(15 if level == 1 else 11.5)
    r.font.color.rgb = RGBColor(0,0,0)

def add_para(doc, text, bold_lead=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(7)
    p.paragraph_format.line_spacing = 1.14
    if bold_lead and text.startswith(bold_lead):
        r = p.add_run(bold_lead)
        r.bold = True
        r.font.name = 'Aptos'
        r.font.size = Pt(10.7)
        rest = p.add_run(text[len(bold_lead):])
        rest.font.name = 'Aptos'
        rest.font.size = Pt(10.7)
    else:
        r = p.add_run(text)
        r.font.name = 'Aptos'
        r.font.size = Pt(10.7)
    for run in p.runs:
        run._element.rPr.rFonts.set(qn('w:eastAsia'), 'Aptos')

def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.08
        r = p.add_run(item)
        r.font.name = 'Aptos'
        r._element.rPr.rFonts.set(qn('w:eastAsia'), 'Aptos')
        r.font.size = Pt(10.4)

def add_table(doc, headers, rows, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.width = Inches(widths[i])
        shade(cell, NAVY)
        set_cell_text(cell, h, bold=True, color='FFFFFF', size=9.2)
    for ri, row in enumerate(rows):
        cells = table.add_row().cells
        for i, val in enumerate(row):
            cells[i].width = Inches(widths[i])
            if ri % 2 == 1:
                shade(cells[i], PALE)
            set_cell_text(cells[i], val, size=8.9)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)

doc = Document()
sec = doc.sections[0]
sec.top_margin = Inches(.68)
sec.bottom_margin = Inches(.64)
sec.left_margin = Inches(.72)
sec.right_margin = Inches(.72)

styles = doc.styles
styles['Normal'].font.name = 'Aptos'
styles['Normal']._element.rPr.rFonts.set(qn('w:eastAsia'), 'Aptos')
styles['Normal'].font.size = Pt(10.7)

add_title(doc, 'UNI ETI Acquirer Thesis Teardown')
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(12)
r = p.add_run('Private working document for Lee Warren')
r.font.name = 'Aptos'
r.font.size = Pt(11)
r.font.italic = True
r.font.color.rgb = RGBColor.from_string(MID)

add_para(doc, 'This document answers the question you asked me to answer: whether the UNI + ETI thesis survives contact with a real investor, strategic buyer, or corporate-development process in the next 18 to 30 months. It is not a product roadmap, a fundraising deck, or legal advice. It is a direct assessment of the asset as it exists today and the proof each possible route would require.')

add_heading(doc, 'Bottom line')
add_para(doc, 'UNI + ETI is a serious category thesis with a stated working product core. It is not yet transaction-ready. Lee’s materials say the scoring engine, 120 rubrics, capability card, API, and UI are built and running; validation on real people is in progress; and the immutable ETI ledger and signed export are the active build. That is materially different from “just an idea.” The missing work is to verify and package those claims into an asset a buyer can diligence.', 'UNI + ETI is a serious category thesis with a stated working product core. ')
add_para(doc, 'The central mistake would be treating the regulatory calendar, the research, and the eventual strategic value as proof that a buyer must act now. They are hypotheses about why a buyer might care. They are not, by themselves, a transaction-ready asset.')

add_heading(doc, 'Minimum credible bench comes first')
add_para(doc, 'For a pre-revenue company, “bench” does not mean a miniature executive team. It means the smallest group that makes the next build and validation step believable. Lee already supplies founder conviction, domain research, commercial instincts, and the product thesis. The immediate question is whether the product has enough technical and methodological credibility around him to survive a serious investor or strategic conversation.')
add_table(doc, ['Needed role', 'What the person must credibly cover', 'Evidence to put on paper'], [
    ['Lee as founder and product owner', 'The problem, customer and category insight, GTM doctrine, product decisions, and why this must exist.', 'A clear founder story, a precise asset statement, and a record of what he has built, researched, and can personally lead.'],
    ['Technical build owner', 'The existing engine, API/UI, data architecture, integrations, and the ETI ledger or provenance build.', 'Name, role, relationship, commitment level, and what they have actually built or agreed to build. This can be a technical cofounder, a studio partner, or a contracted technical lead.'],
    ['Measurement advisor', 'A credible check on the scoring and validation claims as he moves from synthetic proof to real people and real decisions.', 'Name, credentials, a bounded advisor remit, and a clear validation plan. This does not need to be a full-time hire or cofounder.']
], [1.55, 2.65, 2.65])

doc.add_page_break()
add_heading(doc, 'What exists today')
add_table(doc, ['Asset component', 'What the record supports', 'What is not yet established'], [
    ['Category thesis', 'An independent, vendor-neutral evidence and trust layer for consequential workforce decisions in an AI-mediated labor market.', 'Whether this category is urgent enough for an investor or buyer to fund before the market proves it.'],
    ['Product architecture', 'Lee’s materials state that the engine, 120 rubrics, capability card, API, and UI are built and running; synthetic separation is proven; human validation is in progress. ETI ledger and signed export are active build.', 'A product inventory and demonstration that distinguishes production-ready, prototype, synthetic-test, and planned components. The record does not independently verify the stated build.'],
    ['Research and legal framing', 'A substantial, organized body of academic, regulatory, case-law, and market research, including an eight-paper program.', 'Published work, peer review, legal opinions, institutional endorsement, or a recognized certification standard.'],
    ['Commercial concept', 'A bundled assessment or governed decision record that could be bought as a discrete engagement.', 'A committed buyer, design partner, LOI, paid pilot, or evidence that a defined audience values the package.'],
    ['Team and defensibility', 'Lee has domain research, enterprise-sales experience, and informal validators.', 'A technical founder or team, committed advisors, proprietary data rights, documented IP position, or a credentialing institution.']
], [1.35, 2.75, 2.75])

add_heading(doc, 'Draft one page transaction asset')
add_para(doc, 'This is drafted from the materials already supplied. It is not another blank page for Lee to fill out. Its job is to make the asset understandable to a serious external party without asking them to decode the entire research program.')
add_para(doc, 'UNI + ETI is building an independent evidence layer for consequential GTM workforce decisions. UNI evaluates demonstrated sales capability through controlled, role-specific performance events and produces a multi-dimensional capability card. ETI is the trust layer beneath that judgment: a planned immutable, timestamped, attributable, and independently verifiable decision record that preserves the evidence, policy gates, and lineage behind the score. Together, the product is intended to let an employer make promotion, performance, redeployment, hiring, or reduction decisions using a record that can be reconstructed as it existed at the time of the decision, while giving the individual a portable, selectively shareable proof of capability.')
add_table(doc, ['Included in the asset today', 'In active build or validation', 'Not yet evidenced as complete'], [
    ['Scoring engine; 120 stated rubrics across six personas; capability card; API and UI; encoded GTM doctrine; pricing and package architecture; extensive research and regulatory framing.', 'Validation on real people; immutable ETI ledger; signed export; proof that the full system operates together in a real workflow.', 'Independent validation results; production security and integration evidence; a recognized credential or standard; externally committed partners; documented IP ownership and protectability; evidence of buyer or investor pull.']
], [2.2, 2.2, 2.2])

doc.add_page_break()
add_heading(doc, 'What is actually being sold')
add_para(doc, 'The strongest version of the asset is not “a better hiring assessment.” It is a vendor-neutral, reconstructable evidence layer for high-consequence workforce decisions. The architecture is intended to make a capability claim traceable, reviewable, portable, and more defensible than a black-box assessment or an employer-owned performance record.')
add_para(doc, 'That is a coherent thesis. The problem is that it currently exists at several levels at once: research agenda, legal argument, standard, credential, evaluation product, governance layer, and possible software platform. A buyer cannot acquire “all of that” as an abstract future. The transaction needs a specific asset with a specific reason to buy rather than build.')

add_heading(doc, 'The routes are not interchangeable')
add_table(doc, ['Route', 'What they would be buying or funding', 'Current readiness', 'What would change the answer'], [
    ['Private equity', 'An established company with revenue, repeatable operations, customers, and cash flow.', 'Not credible now. UNI has none of the normal PE purchase criteria.', 'Years of operating performance. This is not an early-stage shortcut.'],
    ['Angel or pre-seed VC', 'A founder and team with a large credible market, a defined product thesis, and enough proof to justify funding a build.', 'Possible, but early. The thesis is stronger than the company. Team and external commitment are the immediate gaps.', 'Technical cofounder or build partner, a sharply bounded first product, credible operators, and external proof of demand or access.'],
    ['Venture studio', 'A compelling founder and thesis that the studio believes it can help turn into a company.', 'Possible but selective. Past non-responses are not proof of rejection by the market, but they are not traction.', 'A clear founder role, willingness to share control, and a narrow opportunity a studio can staff and test.'],
    ['Strategic co-design or license', 'A strategic gap a serious institution wants help solving, with a product or method it cannot readily create alone.', 'Plausible only if a named institution engages at product, policy, or business-unit level. It creates IP and independence risk.', 'A defined counterpart, written scope, rights boundaries, and evidence that the strategic partner will commit more than meetings.'],
    ['Strategic acquisition', 'A team, product, customer or partner relationships, data, credibility, or capability that is cheaper or faster to buy than build.', 'Low probability today. There is no operating asset yet for Workday, Microsoft, or another buyer to acquire.', 'A technical and domain team, working proof, protected or difficult-to-recreate assets, and visible strategic pull.']
], [1.25, 2.3, 1.45, 1.85])

add_heading(doc, 'The acquirer thesis under pressure')
add_para(doc, 'The hypothesis that a major platform will need a neutral evidence layer may be right. But it is not enough to say that the platform has money, faces regulatory pressure, and could benefit from a corrective narrative. Large companies can build, partner, wait, or buy. UNI becomes acquirable only when it has created something that is difficult to recreate or politically valuable to acquire.')
add_bullets(doc, [
    'The regulatory calendar creates attention, not an automatic buyer. A regulation can be delayed, interpreted narrowly, handled through internal controls, or addressed by an incumbent partnership.',
    'Neutrality is strategically interesting but commercially complicated. A platform may not want a truly independent signer, and a co-design agreement can weaken the independence that is supposed to be the moat.',
    'The research corpus establishes seriousness. It does not yet create proprietary technology, regulatory authority, a recognized credential, or exclusive data access.',
    'A first customer pattern does not permanently define the company, but it does provide the proof that makes any later category claim believable. If revenue is not the chosen proof, another credible external commitment must take its place.',
    'An acquirer cannot be treated as a generic endpoint. Workday, Microsoft, ServiceNow, an audit firm, and a venture studio would each need materially different reasons to engage.'
])

add_heading(doc, 'What has to be true for the desired outcome')
add_table(doc, ['Required proof', 'Why it matters', 'Evidence currently present', 'Specific gap to close'], [
    ['A coherent transaction asset', 'A buyer must be able to describe precisely what it is acquiring and why it cannot simply recreate it.', 'A stated engine, rubric library, capability card, API/UI, ETI architecture, pricing model, and research thesis.', 'Create an auditable inventory: what is live, prototype, synthetic-test only, active build, or future concept. Document ownership, code repository, data rights, and the exact product demo.'],
    ['A credible founding bench', 'Investors and acquirers need to understand who can build and validate an ambitious technical product around the founder.', 'Lee’s domain knowledge, sales background, informal validators, and stated engine/API/UI product core.', 'Put the technical build owner and a bounded measurement advisor relationship on paper. Neither employment counsel nor a transaction lead is a pre-revenue bench requirement. A validator is not a team member.'],
    ['External commitment', 'Someone outside UNI must take a real risk, incur work, or make a formal commitment. That is what converts a thesis into market evidence.', 'Target-customer categories and a pricing model exist. The materials do not show a signed commitment.', 'Secure one written commitment. An LOI, or letter of intent, is a document in which a prospective partner says it intends to explore or pursue a defined relationship. It is usually nonbinding except for stated clauses, so it is not revenue, but it is more meaningful than verbal encouragement. Alternatives include a paid design-partner agreement, advisor agreement, research collaboration, data-access agreement, or co-design scope.'],
    ['Defensibility', 'The asset must be more valuable to buy than to reproduce internally or obtain from a partner.', 'Hypothesized through neutrality, encoded doctrine, rubric library, scoring approach, research, and a planned immutable evidence layer.', 'Validate the scoring with real cohorts; establish what is proprietary and protectable; obtain independent methodological review; document what makes the product hard to recreate; avoid giving away the core IP in a strategic partnership.'],
    ['A specific counterparty path', 'A transaction requires a named buyer type, relevant decision-makers, and a reason to engage now.', 'Lee has said he has a target-customer list and has named strategic categories such as HCM platforms, enterprise platforms, insurers, and audit or advisory firms. The actual customer list was not included in the materials reviewed here.', 'Britt will build the first-pass shortlist of route-appropriate funds, studios, and strategic business units. Lee then needs to identify warm paths, select the highest-fit names, and decide which one route he is actually pursuing.']
], [1.2, 1.7, 1.85, 1.9])

doc.add_page_break()
add_heading(doc, 'The decision for the next 90 days')
add_para(doc, 'You do not need to choose the customer-funded route if you do not want to operate that kind of company. You do need to choose the external commitment that will substitute for customer traction. The next 90 days should pursue one route, not all of them simultaneously.')
add_bullets(doc, [
    'Choose one primary route: pre-seed or angel build, venture studio, strategic co-design or license, or direct strategic-acquirer exploration. Do not use “PE/VC/strategic” as one category.',
    'Write one page defining the transaction asset: what UNI owns, what is built, what is research, what requires a partner, and what an acquirer receives on day one.',
    'Name the minimum credible bench: Lee as founder and product owner, the technical build owner, and a bounded measurement advisor. Identify who has actually committed versus who is only a possible validator.',
    'Use the first-pass target shortlist Britt develops for the chosen route. Lee’s job is not to invent a list from scratch. His job is to identify warm paths, select the highest-fit names, and decide where he is genuinely willing to engage.',
    'Secure one external commitment that costs the other party something: a co-design letter, advisor commitment, technical partnership, data-access agreement, formal research collaboration, or paid pilot. Revenue is one option, not the only option.',
    'Use the IP-lawyer question list below to assess ownership, protectability, and the implications of sharing the framework with strategic partners. This is legal work, not a substitute for it.'
])

add_heading(doc, 'Questions for the IP lawyer')
add_bullets(doc, [
    'What does Lee or UNI actually own today: code, rubrics, content, names, domains, research synthesis, visual designs, data structures, and any contributed work?',
    'What needs assignment agreements, work-for-hire language, contributor agreements, or confidentiality agreements before he shows the product to investors, advisors, contractors, or strategic partners?',
    'What is realistically protectable through copyright, trademark, patent, trade secret, contract, or none of the above? What should not be described as proprietary?',
    'Does the planned scoring and workforce-decision product create employment-law, consumer-reporting, privacy, AI, credentialing, or regulated-decision exposure that changes the legal structure or product claims?',
    'How can UNI preserve independence if a strategic platform, insurer, employer, or advisory firm funds or co-designs part of the product?',
    'What rights should UNI refuse to grant in a pilot, co-design, data-sharing, or investment agreement so that the core asset is not quietly transferred?',
    'What evidence, policies, consent flows, retention rules, and data-processing agreements must exist before using real people, their work artifacts, or employment-related records in validation?',
    'What must be true before the company makes claims such as immutable, admissible, independently verifiable, employee-owned, defensible, or certification-grade?'
])

doc.add_page_break()
add_heading(doc, 'Homework before our next meeting')
add_para(doc, 'Come prepared to make the following choices. The point is not to finish the company on paper. The point is to stop treating several incompatible paths as one plan.')
add_table(doc, ['Question', 'Your answer must include'], [
    ['1. Which route are you choosing for the next 90 days?', 'One route only, why it fits the outcome you want, and what you are explicitly not pursuing during that period.'],
    ['2. What is the transaction asset?', 'A one-sentence description, the concrete components that exist now, and the specific components that must be created.'],
    ['3. Who is the first serious counterparty?', 'A named organization or investor type, the relevant function, the person you need to reach, and why they would care now.'],
    ['4. What proof are you willing to build?', 'One external commitment you will pursue and what it will demonstrate to the next buyer or investor.'],
    ['5. Who is on the credible bench?', 'Names, roles, relationship status, and what each person has actually agreed to do.']
], [2.35, 4.5])

add_heading(doc, 'My recommendation')
add_para(doc, 'Do not pursue PE. Do not present a strategic acquisition in 20 to 30 months as a plan. Treat it as a possible outcome. The most credible routes to explore now are a small pre-seed or angel-backed build and a carefully bounded strategic co-design relationship. The choice depends on whether you are willing to assemble a team and build independently, or whether you are willing to trade some independence for a serious institution’s commitment.')
add_para(doc, 'The immediate work is to make the asset legible. The research needs to become a defined transaction story: what exists, what it proves, what is defensible, who is behind it, and what the next outside party is being asked to do. That is the bridge between the company in your head and a real capital or strategic conversation.')

add_heading(doc, 'Source basis')
add_para(doc, 'This assessment is based on the UNI + ETI positioning and legal materials, pricing model, regulatory and authority maps, the email exchanges leading into sessions two and three, and the September 8 working session. It distinguishes claims and plans in those materials from externally validated proof. It does not independently validate legal conclusions, market-size claims, deal comparables, or regulatory timelines.')

doc.save(OUT)
print(OUT)
