import simulateEvent from 'simulate-event';
import lolex from 'lolex';
import {getSrcs} from '../options';

jest.mock('image-promise', () => srcs => Promise.resolve(
    srcs.map(src => {let img = new global.Image(); img.src = src; return img;})
));

export default function(img) {

    const clock = lolex.install();

    function setsSrc(point, src, element = document) {
        clock.tick(100);
        simulateEvent.simulate(
            element,
            'mousemove',
            {clientX: point[0], clientY: point[1]}
        );
        expect(img.src).toBe(src);
    }

    it('caches the preloaded images', () => {
        let preloadedSrcs = img.creepyFaceReachableImages.map(img => img.src);
        expect(preloadedSrcs).toContain('srcUrl');
        expect(preloadedSrcs).toContain('hoverUrl');
        expect(preloadedSrcs).toContain('northUrl');
        expect(preloadedSrcs).toContain('northEastUrl');
        expect(preloadedSrcs).toContain('eastUrl');
        expect(preloadedSrcs).toContain('southEastUrl');
        expect(preloadedSrcs).toContain('southUrl');
        expect(preloadedSrcs).toContain('southWestUrl');
        expect(preloadedSrcs).toContain('westUrl');
        expect(preloadedSrcs).toContain('northWestUrl');
    });

    it('has the original src by default', () => expect(img.src).toBe('srcUrl'));
    it('hovers', () => setsSrc([ 0, 0], 'hoverUrl', img));

    it('looks north'     , () => setsSrc([ 0, -1], 'northUrl'));
    it('looks north-east', () => setsSrc([ 1, -1], 'northEastUrl'));
    it('looks east'      , () => setsSrc([ 1,  0], 'eastUrl'));
    it('looks south-east', () => setsSrc([ 1,  1], 'southEastUrl'));
    it('looks south'     , () => setsSrc([ 0,  1], 'southUrl'));
    it('looks south-west', () => setsSrc([-1,  1], 'southWestUrl'));
    it('looks west'      , () => setsSrc([-1,  0], 'westUrl'));
    it('looks north-west', () => setsSrc([-1, -1], 'northWestUrl'));
}